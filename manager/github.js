/*
 * Uploading to GitHub from the Manager (iPhone/iPad friendly: no zip, no GitHub upload page).
 *
 * Uses a fine-grained personal access token limited to this repo (Contents: Read and write).
 * The token is kept in the same IndexedDB as the remembered key ('slideshow-vault' / 'keys', entries
 * 'github:<vault salt>'), encrypted with the vault key, so it's useless without the passphrase and Lock
 * deletes it. One entry per vault, like the key: after a passphrase change the website keeps the old
 * vault for a minute or so, and the token must still open then.
 *
 * An upload is one commit made with the Git Data API: blobs → tree (on top of the current one, with
 * deletions) → commit → move the branch, never forced. If the branch moved meanwhile, it fails.
 */
'use strict';
(function () {
  const OWNER = 'WallieEverest', REPO = 'pages', BRANCH = 'main';
  // Tests on this computer can point it at a fake API; the real site always uses GitHub.
  const API = (/^(127\.0\.0\.1|localhost)$/.test(location.hostname) && localStorage.getItem('githubApi')) || 'https://api.github.com';
  const te = new TextEncoder(), td = new TextDecoder();
  let token = null, tokenExpires = null;

  const b64 = u8 => { let s = ''; for (let i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000)); return btoa(s); };

  /* ----- Token storage ----- */
  function withStore(mode, fn) {
    return new Promise((res, rej) => {
      const o = indexedDB.open('slideshow-vault', 1);
      o.onupgradeneeded = () => o.result.createObjectStore('keys');
      o.onerror = () => rej(o.error);
      o.onsuccess = () => {
        const db = o.result, t = db.transaction('keys', mode), req = fn(t.objectStore('keys'));
        t.oncomplete = () => { db.close(); res(req.result); };
        t.onerror = t.onabort = () => { db.close(); rej(t.error); };
      };
    });
  }
  // Returns {token, expires} or null (none saved, or saved under a different passphrase).
  async function loadToken(key, vault) {
    try {
      const v = await withStore('readonly', s => s.get('github:' + vault.salt));
      if (!v) return null;
      token = td.decode(await Vault.decrypt(key, v.blob)); tokenExpires = v.expires || null;
      return { token, expires: v.expires || null };
    } catch { return null; }
  }
  async function saveToken(key, vault, t, expires) {
    token = t; tokenExpires = expires || null;
    const blob = await Vault.encrypt(key, te.encode(t));
    await withStore('readwrite', s => s.put({ salt: vault.salt, blob, expires: tokenExpires }, 'github:' + vault.salt));
  }
  // After a passphrase change: save the token under the new key too.
  async function rekey(key, vault) {
    if (token) await saveToken(key, vault, token, tokenExpires);
  }
  async function forgetToken() {
    token = tokenExpires = null;
    try {
      const ids = await withStore('readonly', s => s.getAllKeys());
      await withStore('readwrite', s => { let q; for (const id of ids) if (String(id).startsWith('github:')) q = s.delete(id); return q || s.count(); });
    } catch {}
  }

  /* ----- API ----- */
  async function api(path, opts = {}, t = token) {
    let r;
    try {
      r = await fetch(API + '/repos/' + OWNER + '/' + REPO + path, {
        method: opts.method || 'GET', cache: 'no-store',
        headers: Object.assign({ Authorization: 'Bearer ' + t, Accept: 'application/vnd.github+json' },
          opts.body ? { 'Content-Type': 'application/json' } : {}, opts.headers || {}),
        body: opts.body ? JSON.stringify(opts.body) : undefined
      });
    } catch { throw new Error('Could not reach GitHub (no connection?).'); }
    if (r.ok) return r;
    if (r.status === 404 && opts.allow404) return null;
    let msg = '';
    try { msg = (await r.json()).message || ''; } catch {}
    const e = new Error(
      r.status === 401 ? 'GitHub doesn\'t accept this token any more (expired or revoked). Connect again.'
      : r.status === 403 || r.status === 404 ? `This token can't write to ${OWNER}/${REPO}: check it has Contents: Read and write for this repo.`
      : 'GitHub error ' + r.status + (msg ? ': ' + msg : ''));
    e.status = r.status;
    throw e;
  }
  const json = async (path, opts) => (await api(path, opts)).json();

  // Checks a token before saving it. Returns its expiry date when GitHub shares it.
  async function check(t) {
    const r = await api('', {}, t);
    const info = await r.json();
    if (info.permissions && info.permissions.push === false) throw new Error(`This token can't write to ${OWNER}/${REPO}: give it Contents: Read and write for this repo.`);
    return { expires: r.headers.get('github-authentication-token-expiration') };
  }

  async function readHead() {
    return (await json('/git/ref/heads/' + BRANCH)).object.sha;
  }

  // File bytes at a commit (default: the branch), or null if it doesn't exist.
  async function readFile(path, ref) {
    const r = await api('/contents/' + path + '?ref=' + (ref || BRANCH), { allow404: true, headers: { Accept: 'application/vnd.github.raw' } });
    return r ? new Uint8Array(await r.arrayBuffer()) : null;
  }

  async function listDir(dir, ref) {
    const r = await api('/contents/' + dir + '?ref=' + ref, { allow404: true });
    const list = r ? await r.json() : [];
    return Array.isArray(list) ? list.map(f => f.path) : [];
  }

  // One commit on top of `parent`: add/replace `files` [{path, bytes}], delete `remove` [path].
  // Throws an Error with .conflict = true if the branch moved since `parent`.
  async function upload({ parent, files, remove, message, onProgress }) {
    const tree = [];
    for (let n = 0; n < files.length; n++) {
      if (onProgress) onProgress(n + 1, files.length);
      const { sha } = await json('/git/blobs', { method: 'POST', body: { content: b64(files[n].bytes), encoding: 'base64' } });
      tree.push({ path: files[n].path, mode: '100644', type: 'blob', sha });
    }
    if (remove.length) {   // only delete what's there (GitHub refuses to delete a missing file)
      const there = new Set();
      for (const dir of new Set(remove.map(p => p.slice(0, p.lastIndexOf('/'))))) (await listDir(dir, parent)).forEach(p => there.add(p));
      for (const path of remove) if (there.has(path)) tree.push({ path, mode: '100644', type: 'blob', sha: null });
    }
    const base = (await json('/git/commits/' + parent)).tree.sha;
    const t = await json('/git/trees', { method: 'POST', body: { base_tree: base, tree } });
    const c = await json('/git/commits', { method: 'POST', body: { message, tree: t.sha, parents: [parent] } });
    try {
      await api('/git/refs/heads/' + BRANCH, { method: 'PATCH', body: { sha: c.sha, force: false } });
    } catch (e) {
      if (e.status === 422 || e.status === 409) { const x = new Error('Changed on another device: reload to see the latest, then make your edits again.'); x.conflict = true; throw x; }
      throw e;
    }
    return { sha: c.sha, url: c.html_url || `https://github.com/${OWNER}/${REPO}/commit/${c.sha}` };
  }

  window.GitHub = {
    repo: OWNER + '/' + REPO,
    uploadPage: dir => `https://github.com/${OWNER}/${REPO}/upload/${BRANCH}/${dir}`,
    tokenPage: 'https://github.com/settings/personal-access-tokens/new',
    connected: () => !!token,
    loadToken, saveToken, rekey, forgetToken, check, readHead, readFile, upload
  };
})();
