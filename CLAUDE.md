# Claude instructions

Static GitHub Pages site with one installable iPhone/iPad web app, **Boating** (`weather/`), plus the launcher `index.html`. Plain HTML/CSS/JS, no build step. The Slideshow and Manager were removed on 2026-11-12: `slideshow/` and `manager/` only hold "removed" stubs that clear the old apps from devices (delete them once every device has opened them). The planned Kiosk was dropped.

## Where things are written down

- `configuration.md`: the full technical reference, working rules, URLs, versions, test notes and every plan (**Plans and history**). Read it before changing anything. While the repo is public it's gitignored and kept only on the PC; once the repo is private it's committed (see `recovery.md`).
- `readme.md`: user-facing setup and iPhone/iPad instructions.
- `recovery.md`: moving the repository, and restoring the project on a new PC.
- No other Markdown files: new plans go in `configuration.md`, not in separate `*-plan.md` files.

## Standing rules from the user

These were kept in Claude's local memory before 2026-11-09. They're written here so a fresh clone keeps them.

- **Plan first.** When asked for a plan, or for a large or unclear change, write it as a new section under **Plans and history** in `configuration.md`, summarize it in chat, and write no code until the user says "build".
- **"Upload", never "publish",** for sending files to GitHub, in app text, the readme and plans (the removed Manager's button was "Upload to GitHub…"). Saving to the device is "download". Commit messages may name the Git mechanism.
- **Read GitHub file bytes with the Git blob API** (`GET /repos/{owner}/{repo}/git/blobs/{sha}`, base64). Use the contents API only for metadata (the blob `sha`, listings). It turns small binary files into UTF-8 text, which broke the (now removed) Manager on 2026-11-02. Test fakes of GitHub should copy that conversion.
- **Folder names are always lower case** (repo folders, and any cloud-storage folders). App titles are capitalized ("Boating").
- **Bump `VERSION` in an app's `sw.js`** after changing its `index.html` or `sw.js` (Boating: `weather/sw.js`), and the launcher's `VERSION` in `index.html` when it changes.
- **Commit or push only when asked.**
- **Never write secrets into the repo:** passphrases, GitHub tokens, API keys or private share links.
