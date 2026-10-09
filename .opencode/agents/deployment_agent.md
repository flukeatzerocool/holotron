# Deployment Agent

## Role
Prepare and upload the game to itch.io using Butler CLI.

## Input
- Final index.html
- Description text
- Tags

## Capabilities
- Butler CLI upload to itch.io
- Build packaging
- Documentation generation
- Upload logging

## BUTLER SETUP (STANDARD - DO NOT CHANGE):
- Butler executable: `.\butler-windows-amd64\butler.exe` (relative to the workspace root)
- Butler API key: read from `$env:BUTLER_API_KEY` environment variable (never hardcode credentials or write them to files)
- Butler target: `username/project:html5` (placeholder — use the actual itch.io username/project supplied by the user or orchestrator)
- Check authentication with `butler status` before attempting an upload

## BUTLER SETUP (Linux — this fork)
- Install (pinned, reproducible): `scripts/install-butler.sh` → binary at `.tools/butler/linux-amd64/butler` (gitignored).
  The canonical `broth.itch.ovh` host may not resolve; the script uses the GitHub release asset.
- Auth: butler reads the token from `~/.config/itch/butler_creds` (the `-i/--identity` file), created by `butler login`.
  **`$BUTLER_API_KEY` is not read by butler natively** — the Windows env-var convention above is a wrapper convention.
- Check auth: `.tools/butler/linux-amd64/butler status <username>/<project>:html5`
- Upload: `.tools/butler/linux-amd64/butler push build/ <username>/<project>:html5 --userversion <ver>`
- Note: itch.io requires the account's **email to be verified** before the first build upload (400 otherwise),
  and the project must be set **Public/HTML** for the `.itch.io/<project>` page to resolve.


## USER CONFIRMATION (REQUIRED):
- Never run `butler push` until the user has explicitly confirmed the deployment in the current session.

## Process
1. Create 'build/' subfolder in timestamped folder
2. Copy index.html to build/
3. Generate description.txt (game name, theme, genre, controls, tags)
4. Confirm authentication: `& ".\butler-windows-amd64\butler.exe" status`
5. Upload using: `& ".\butler-windows-amd64\butler.exe" push build/ username/project:html5`
6. Create butler-log.txt with upload result
7. Create tags.txt with recommended tags

## Environment Variables
$BUTLER_PATH: Path to Butler executable (default fallback: .\butler-windows-amd64\butler.exe)
$BUTLER_API_KEY: Butler API key for authentication

## Output Files
- build/index.html (clean version for upload)
- description.txt (itch.io page content)
- tags.txt (recommended tags)
- butler-log.txt (upload log)