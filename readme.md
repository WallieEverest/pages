# iPhone Web Apps: Boating + Slideshow

Home-screen apps for iPhone, hosted free on GitHub Pages at **https://wallieeverest.github.io/pages/**. No App Store, no build step, no API keys.

- **Boating**: local wind, weather and the National Weather Service marine forecast for wherever you are.
- **Slideshow**: a full-screen photo slideshow, with optional encryption for private photos.
- **Manager**: adds, captions and encrypts photos for the slideshow.

```
index.html                      launcher page ("My Apps") linking the apps; manifest.json, icons/
weather/                        Boating app (Open-Meteo + National Weather Service data)
slideshow/                      photo slideshow
  vault.js                      encryption code shared by the slideshow and manager
  photos/                       photos (encrypted .enc files, or plain images)
  vault.json, photos.enc        created when you switch to encrypted photos
  photos.json                   photo list for unencrypted mode
manager/                        Manager: encrypts photos for upload
tools/encrypt_photos.py         command-line alternative to the Manager
.github/workflows/update-photos.yml
```

Each app has its own `manifest.json`, service worker and icon, so each becomes a separate icon on the home screen. **Boating** and **Slideshow** open full screen. **My Apps** and the **Manager** open in Safari, as normal pages.

Every app shows its version number: Boating at the bottom of the page, the Slideshow under its control buttons (and on the passphrase screen), the Manager in its footer, and My Apps in its footer and on each app's card.

## 1. Publish to GitHub Pages

1. Create a new **public** repository on GitHub, e.g. `pages` (all lowercase: the name becomes part of the URL, which is case-sensitive).
2. Upload the contents of this folder (keep the folder structure, including `.github`).
   On github.com: **Add file → Upload files**, drag everything in, commit.
   The `.github` folder is hidden on Mac/Linux; press Cmd+Shift+. in Finder to see it, or create the workflow file through the GitHub web editor instead.
3. **Settings → Pages**: Source = *Deploy from a branch*, Branch = `main`, folder `/ (root)`. Save.
4. After about a minute the site is live at `https://wallieeverest.github.io/pages/`.

## 2. Install on iPhone

Type addresses exactly as shown: they are case-sensitive (`pages`, `weather`, `slideshow` and `manager` are all lowercase).

**Boating**

1. In **Safari**, open `https://wallieeverest.github.io/pages/weather/`.
2. Allow location when asked, or type a city or ZIP code in the search box. The app uses the location to find your marine forecast zone.
3. Tap **Share → Add to Home Screen**. The recommended name is **Boating** (it is filled in for you).
4. Keep **Open as Web App** on and tap **Add**.

**Slideshow**

1. In **Safari**, open `https://wallieeverest.github.io/pages/slideshow/`.
2. Tap **Share → Add to Home Screen**, keep **Open as Web App** on, tap **Add**.

**Manager** (optional: only needed on the device you add photos from)

1. In **Safari**, open `https://wallieeverest.github.io/pages/manager/`.
2. Tap **Share → Add to Home Screen** (the name **Manager** is filled in for you), turn **Open as Web App** **off**, and tap **Add**. The icon then opens the Manager in Safari, where GitHub links and downloads work as usual.

**My Apps** (optional: the launcher page)

1. In **Safari**, open `https://wallieeverest.github.io/pages/`.
2. Tap **Share → Add to Home Screen**, turn **Open as Web App** **off**, and tap **Add**.

An icon keeps the mode it was added with. To change it (for example a Manager icon added full screen before November 2026), delete the icon and add it again.

Open each app once while online so it can save itself for offline use.

If you had an older home-screen icon (for example one named *Weather*, or one added from an address with a capital *P*), delete it and add the app again from the address above.

## Boating

**What it shows**, top to bottom:

- **Now:** temperature and conditions at your location.
- **Hourly** (next 24 hours): conditions, chance of rain, temperature, and **wind**: the arrow points the way the wind is blowing, with the direction it comes from (N, NE, …), speed in knots, and gusts (*G18* = gusts to 18 kt).
- **7-Day Forecast**: daily lows and highs. The bar colors run from blue at the week's lowest temperature to red at its highest.
- **Wind** (speed, direction and gusts), feels-like temperature, humidity, UV index, sunrise and sunset.
- **Marine Forecast** from the National Weather Service, at the bottom because it takes longest to load (it says *Loading marine forecast…* until it arrives):
  - **Alerts** for your marine zone and location, such as Small Craft Advisories, Gale Warnings, Special Marine Warnings, High Surf and Rip Currents. Tap one for the full details. The stripe color shows severity: red (severe), orange (moderate), yellow (minor).
  - **Zone forecast**: the official wind, seas and wave forecast for the next few days. The marine zone is picked automatically: the zone you are in, or from shore the nearest one within about 50 km.
  - **Boating briefings**: the local NWS office's graphics about boating, wind and waves, when it has posted any. Swipe for more; tap one to see it full size.

**Controls**

- **Search** (top left): type a city or ZIP code, such as *Cocoa Beach* or *32931*, and tap Search. US places come first.
- **📍** uses your current location (do this after you move to a different area).
- **°F/°C** changes temperature units. Wind is always in knots.
- Tap the **Marine Forecast** heading to open the full forecast on weather.gov.

**Good to know**

- Marine forecasts cover US coastal waters and the Great Lakes. Elsewhere, the app shows the weather and wind only.
- Everything is saved on the phone and shown instantly when you open the app, even with no signal on the water. It refreshes when you open the app if the saved copy is older than 10 minutes. On a weak signal the app gives up waiting after a few seconds, keeps showing the saved copy, and tries again by itself (the line under the temperature shows *Updating…* or *retrying*, and how old the data is). It also refreshes every 10 minutes while left open. Check the **Updated** and **issued** times before relying on it.
- This app is a convenience, not a navigation or safety device. Always check official forecasts and NOAA Weather Radio before going out.
- Weather data: [Open-Meteo](https://open-meteo.com) (free, non-commercial use). Marine forecasts, alerts and briefings: [National Weather Service](https://www.weather.gov/marine/). Place names: BigDataCloud.

## Slideshow

**Controls:** swipe left/right to change photos, tap to show or hide controls. Controls hide themselves after 3 seconds while playing.
Buttons: previous, play/pause, next, seconds per photo, shuffle (⇄), fill screen (⤢), slow zoom, and caption size (**Aa**: each tap steps through S, M, L and XL).
**Captions** stay on screen in a banner over the bottom of the photo, whether the controls are showing or not. While the controls are showing, the banner moves up above them.
Settings are remembered. The screen stays on while playing (iOS 16.4 and later).

### Private photos (encrypted), recommended

GitHub Pages sites are public, so the slideshow can encrypt your photos. Each photo and the photo list (including captions) are encrypted with AES-256-GCM before they are uploaded. The repo and the website only ever contain scrambled `.enc` files with random names. The slideshow asks for the passphrase once per device, then decrypts photos in memory on the phone.

**First-time setup**

1. Open the Manager, `https://wallieeverest.github.io/pages/manager/`, in Safari (iPhone) or any browser on a computer.
2. Choose a passphrase. Use **four or more random words**: anyone can download the encrypted files and try to guess it. **If you forget it, the photos can't be recovered.** Keep your originals.
3. Tap **Choose photos…** and pick your photos. Leave *Resize* on: it keeps loading fast and strips GPS location and other hidden data. Edit captions if you like (photos named like `IMG_1234` start with no caption).
4. Tap **Download update (.zip)**.
5. Unzip it. On GitHub, open the `slideshow` folder → **Add file → Upload files**, drag in everything from the zip (`vault.json`, `photos.enc` and the `photos` folder), and commit.
6. Delete any plain photos left in `slideshow/photos/` (the `.enc` files stay). Keep `slideshow/photos.json`: once `vault.json` exists it is ignored, and it is only used if you go back to unencrypted photos.
7. Open the slideshow and enter the passphrase. With **Remember on this device** ticked, it isn't asked again. 🔒 (top right, when controls are showing) locks it and forgets the passphrase on that device. The Manager has the same **Remember on this device** option. In the same browser (on a computer, or both in Safari), the two apps share the remembered passphrase: remembering it in either one unlocks both, and locking either one locks both. On iPhone and iPad, each full-screen home-screen app keeps its own storage, separate from Safari. The Slideshow icon and the Manager (in Safari) each ask for the passphrase once, and the GitHub token lives only in the Safari Manager.

**Adding, removing or re-captioning later**: open the Manager again, make the changes, and upload them. The simplest way is **Upload to GitHub** (below), straight from the Manager. Without it, download and upload by hand:
- **Only captions or ticks changed:** the button says **Download photos.enc**. It saves that one file. Upload it on GitHub into `slideshow/` (**Add file → Upload files**), replacing the old one. The Manager shows a direct link to the upload page. Nothing needs unzipping, so this works well on an iPhone. If Files saved it as `photos (1).enc`, rename it to `photos.enc` first.
- **Photos added or removed:** it downloads a zip. Upload its contents the same way as the first time. It replaces `photos.enc`. Removed photos are listed with their file names so you can delete them from `slideshow/photos/`.

**Choosing which photos play**: untick a photo's box in the Manager to leave it (and its caption) out of the slideshow without deleting it. **All** / **None** tick or untick everything, so you can keep a large library and play a chosen set from it. Tick it again any time to bring it back. If you only change ticks, only `photos.enc` changes.

From an iPhone, GitHub's upload page doesn't keep folders. Upload the `.enc` files from the zip's `photos` folder into `slideshow/photos/`, then upload `photos.enc` and `vault.json` into `slideshow/`. (The Manager links to both upload pages.)

**Upload to GitHub, straight from the Manager** (best on iPhone and iPad: no zip, no GitHub website)

Connect a GitHub token once on each device:

1. Signed in to GitHub, open the **Create a token** link in the Manager's **GitHub** box (it opens github.com → Settings → Developer settings → Fine-grained tokens → **Generate new token**).
2. **Token name:** anything, for example *Manager on iPhone*. **Expiration:** the longest offered (GitHub may ask for a new token after that).
3. **Repository access:** **Only select repositories** → **pages**.
4. **Permissions → Repository permissions → Contents:** **Read and write**. GitHub then adds **Metadata: Read-only** by itself. It's required (it lets the token see the repo's basic details) and can't be removed: leave it. Leave everything else as it is.
5. Tap **Generate token**, copy it (it starts with `github_pat_`; GitHub shows it only once), paste it into the Manager and tap **Connect**.

After that, **Upload to GitHub…** appears under the list of changes. It shows what will change. Tap **Upload** and the Manager saves everything to GitHub as one update: new photos, the new list, and deleting removed photo files (and the old files after a passphrase change). The slideshow updates about a minute later. The download is still there as a small link under the button.

- If the photos were changed from another device after you opened the Manager, the upload stops and nothing is changed. Reload and make your edits again.
- When the token expires or is revoked, the Manager says so: create a new one and connect again. **Disconnect** removes it from the device.

**Command line alternative** (if you keep a local clone of the repo):

```sh
pip install cryptography pillow            # + pillow-heif for .HEIC files
python3 tools/encrypt_photos.py add ~/Pictures/trip/*.jpg
python3 tools/encrypt_photos.py list
python3 tools/encrypt_photos.py caption 3 "Mom's 70th birthday"
python3 tools/encrypt_photos.py remove 5 6        # also deletes the .enc files
python3 tools/encrypt_photos.py hide 7 8          # skip in the slideshow, keep in the vault (show 7 8 to undo)
python3 tools/encrypt_photos.py export ~/backup   # decrypt everything
git add -A slideshow && git commit -m "Update photos" && git push
```

The script and the Manager use the same format and passphrase, so you can mix them.

**What is and isn't protected**

- Protected: photo contents, captions and original file names. Even GitHub can't see them.
- Visible to anyone: that the site exists, how many photos there are and roughly how big each one is, and when you uploaded them.
- **Git history:** if real photos were ever committed unencrypted, they stay in the repo's history even after you delete them. If that happened, the simplest fix is to delete the repository, create a new one, and upload only the encrypted files.
- With **Remember on this device** ticked, the device stores a non-exportable browser key and the passphrase itself, so the Manager can show it. Anyone who can open the apps on your unlocked device can see the passphrase there. Leave the box unticked on shared devices, or use 🔒 / **Lock** to clear it.
- **Changing the passphrase:** in the Manager, the **Passphrase** box shows the current one (tap **Show**). Type a new one, repeat it, and tap **Upload to GitHub…** (or **Download update**). Every photo is re-encrypted with new file names. Upload to GitHub does everything, including deleting the old files. With the zip, upload it as usual and delete the old files it lists. Other devices ask for the new passphrase once. Keep the old one until the upload is done: the site uses it until then.
- **GitHub token** (only if you connect one): it's stored on the device encrypted with the photo key, so it can't be read without the passphrase, and **Lock** deletes it. It's kept by the browser it was connected in (on iPhone/iPad: Safari, where the Manager runs). It can only change files in this one repository: it can't touch your account or other repos. If a device is lost, delete the token on github.com (Settings → Developer settings → Fine-grained tokens). Someone using it could change the website, but your photos stay encrypted.

**Technical details:** the key is derived with PBKDF2-HMAC-SHA256 (600,000 iterations, random 16-byte salt in `vault.json`). Each file is a 12-byte random IV followed by AES-256-GCM ciphertext and tag. Everything uses the browser's built-in Web Crypto; there are no third-party libraries.

### Unencrypted photos (simpler, public)

1. Upload images into `slideshow/photos/` on GitHub (Add file → Upload files). JPEG is the safest format; resizing to about 2000 px on the long edge keeps loading fast.
2. The **Update photo list** action runs automatically and rewrites `photos.json` within a minute. Check the **Actions** tab if it doesn't.

**Captions** default to the filename (`grand-canyon_2024.jpg` → "Grand Canyon 2024"). To set your own, edit `photos.json`:

```json
{ "src": "photos/IMG_4021.jpg", "caption": "Mom's 70th birthday" }
```

Use `"caption": ""` to show none. Add `"show": false` to leave a photo out of the slideshow without deleting it. The action keeps what you've written.

Not using the action? Edit `photos.json` by hand; plain strings work too: `["photos/a.jpg", "photos/b.jpg"]`.

**Note:** in this mode, anyone with the URL can see the photos. Also remove the `slideshow/photos/*.jpg` (and similar) lines from `.gitignore`: they stop plain photos being committed from a local clone while the slideshow is encrypted.

## Updating the apps

iPhone caches the apps. After changing an app's code (`index.html`, `vault.js`, `sw.js`), bump `VERSION` at the top of that app's `sw.js` (the Boating app is at `weather-v8`, the slideshow at `slideshow-v5` and the Manager at `manager-v6`; increase the number). The number shows in each app, so you can check a device has the latest. The launcher (`index.html`) has no service worker; bump `VERSION` in its script (`my-apps-v1`) when you change it. `slideshow/vault.js` is used by both the slideshow and the Manager, so after changing it bump both. Then close and reopen the app on your phone, twice if needed.

## Limitations (iOS web apps)

- No home-screen widgets and no background refresh; data updates when you open the app.
- Location permission may be asked again occasionally.
- Storage for a site can be cleared by iOS if the app goes unused for a long time; it simply re-downloads.
