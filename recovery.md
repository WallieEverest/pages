# Moving and recovering this project

How to move the repository to a private one, and how to get the project working again on a new PC from that location. Written 2026-11-09, when the repo was the public `WallieEverest/pages`. Updated 2026-11-12, when the Slideshow and Manager were removed and Boating became the only app.

## What lives where

| Item | Where it is | Moves with the repo? |
|---|---|---|
| App code, icons, `readme.md`, `CLAUDE.md`, this file | The repository | Yes |
| `configuration.md` (technical reference and plans) | The PC only: gitignored while the repo is public | **Only if committed** (step 3 below) |
| Claude's memory | `C:\Users\walli\.claude\projects\c--Users-walli-GitHub-pages\memory\`, tied to this folder path | No. Its rules are copied into `CLAUDE.md` |
| Test pages and scripts | A temporary Claude scratchpad under `%TEMP%\claude\` | No. Windows can delete them at any time (see step 4) |

## Before you move: GitHub Pages and private repos

- On a **free** GitHub account, GitHub Pages only works for **public** repos. Making the repo private takes the website down, and Boating and the launcher stop loading new versions.
- With **GitHub Pro** (paid), Pages works from a private repo. The **website stays public**; only the source code is hidden.
- If you want to stay on the free plan, keep two repositories: a private one with everything (the source of truth), and the public `pages` repo that serves the site, copied over from the private one when you upload a change. Ask Claude to plan that if you choose it.

## Option A (simplest): make the same repo private

`WallieEverest/pages` keeps its name and owner, so URLs and installed home-screen icons keep working.

1. Needs GitHub Pro (above). github.com → the repo → **Settings → General → Danger Zone → Change visibility → Private**.
2. **Settings → Pages:** check that it still deploys from `main`, folder `/`, and open `https://wallieeverest.github.io/pages/` to confirm.
3. **Commit the Claude notes** now that the repo is private: delete the `configuration.md` line from `.gitignore`, then commit `configuration.md` and `.gitignore`. Check first that `configuration.md` holds no passphrase, token, API key or private link.
4. **Save the test kit** (optional but recommended): ask Claude to copy the test pages and scripts from the scratchpad into a `tests/` folder and commit them, so the test steps in `configuration.md` can be run again.

## Option B: a new private repository (new name or owner)

1. Create the empty private repo on github.com (lower-case name). Then on the PC:
   ```
   git remote set-url origin https://github.com/<owner>/<repo>.git
   git push -u origin main
   ```
2. Do steps 2 to 4 of Option A in the new repo (Pages from `main`, `/`; commit `configuration.md`; save the test kit).
3. **New web address:** `https://<owner>.github.io/<repo>/`. Links inside the site are relative, so no code changes. Update the URL table in `configuration.md` and the addresses in `readme.md`. On every iPhone/iPad, delete the old Boating icon and add it again from the new address.
4. **Same owner, new repo name:** the site's storage (Boating's ZIP code and saved forecast) is per owner (`<owner>.github.io`), so it carries over. **New owner:** each device asks for the ZIP code again.
5. Archive or delete the old public repo, or it keeps serving the old site.

## Recovering on a new PC

1. Install Git and VS Code with the Claude Code extension. Sign in to GitHub (private repos need it: `gh auth login`, or Git Credential Manager).
2. Clone into a lower-case folder, ideally the same path as before so Claude's memory folder name matches:
   ```
   git clone https://github.com/<owner>/<repo>.git C:\Users\<you>\GitHub\pages
   ```
3. Open the folder in VS Code and start Claude Code. It reads `CLAUDE.md` automatically. Tell it: "Read configuration.md and recovery.md". Its memory starts empty, which is fine: the rules are in `CLAUDE.md`.
4. Headless tests use Microsoft Edge (already on Windows) and Python, from the `tests/` folder if it was saved.
5. Check that the site still works: open the launcher and Boating, and enter a ZIP code.
