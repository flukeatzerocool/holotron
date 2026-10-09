# Holotron — Deployment Plan (Phase 3/4, critical path)

**Status:** DRAFT — awaiting `plan-review` + user confirmation before execution.
**Why this exists:** a green Phase 1+2 (`PLAN_PHASE1.md`) submits **nothing**. The
`COMPLIANCE.md` requirement is an **itch.io HTML5 upload** by Oct 11 12:00 plus a public
fork. `deployment_agent.md` is Windows/PowerShell-only and **no butler binary exists on
this machine** (`which butler` → not found). This plan schedules the missing path.
**Mode boundary:** PLAN is read-only. BUILD starts only on user confirmation.

**Execution order (see `PLAN_PHASE1.md` §0):** D0 (user, start now) → **deploy smoke test
Part A (D1–D4, placeholder build, do FIRST)** → `PLAN_PHASE1.md` Step 0 spike → single #7
run → **Part B (D5–D7, final push after the game exists)**. The smoke test proves the
submission path before any pipeline run; it is a fixture, never the submission.

---

## 1. Objective & done-bar

**Objective.** Get the finished single-file game uploaded to itch.io as an **HTML5**
build on Linux, reproducibly, with the process documented.

**Done-bar.**
1. Butler (Linux) installed in-repo from a **pinned** release.
2. `butler status <user>/<game>` authenticates successfully (credentials present).
3. `butler push build/ <user>/<game>:html5 --userversion <ver>` succeeds; the build is
   live at `https://<user>.itch.io/<game>` and playable in a browser.
4. `deployment_agent.md` updated to a **platform-aware** form (Linux path preserved
   alongside the Windows path) and `butler-log.txt` records the upload.
5. Upload artifacts committed and pushed to the public fork.

---

## 2. Verified facts (evidence)

| Fact | Evidence |
|---|---|
| No butler on the machine; no `$BUTLER_API_KEY`/`$ITCH_USERNAME`/`$ITCH_PASSWORD` set | `which butler` → not found; env probe in this session |
| Canonical download host `broth.itch.ovh` **does not resolve here** (`http=000`, DNS FAIL) | `getent hosts` + `curl -sI` |
| Butler ships **GitHub release** binaries incl. `butler-linux-amd64.zip` | `gh release list --repo itchio/butler`; API assets v15.32.0 |
| The Linux binary **runs** here | `/tmp/.../butler --version` → `v15.32.0` |
| `butler login` saves the token to `~/.config/itch/butler_creds` (the `-i/--identity` file) | `butler push/status/login --help` |
| Target = `project:channel`; project = `username/game`, game id, or game URL; channel e.g. `html5` | `butler push --help-long` |
| `deployment_agent.md` hardcodes `.\butler-windows-amd64\butler.exe` + `$env:BUTLER_API_KEY` | `deployment_agent.md` |

> Correction to the repo's assumption: **butler does not read `$BUTLER_API_KEY` natively**
> — it reads the `butler_creds` file (`-i`). The env var is a wrapper convention.

---

## 3. Decisions (with alternatives)

| Decision | Chosen | Alternatives rejected |
|---|---|---|
| Butler source | **GitHub release** `butler-linux-amd64.zip` (pinned version) | `broth.itch.ovh` (DNS dead here); itch web page (link target may be dead host) |
| Install location | repo-local `.tools/butler/` (gitignored) via `scripts/install-butler.sh` | `~/bin` (not reproducible for the fork); system install (needs sudo) |
| Auth | `butler login` (interactive, once) → `butler_creds` | piping `$BUTLER_API_KEY` into a creds file (format unverified) — spike can adopt it if confirmed |
| `deployment_agent.md` | keep Windows instructions; **add a Linux section** | rewrite Windows→Linux (loses the upstream path) |
| Fallback | **itch app GUI** (v26.12+, bundles butler, Builds page) | none — this is the no-CLI backup |

---

## 4. Steps

**Part A — Deploy smoke test (do FIRST, before the game build).**

**Step D0 — Prerequisites (OWNER: user; blockers). Start now.**
- Create/choose the itch.io **project** and configure it as an **HTML5** game; note the
  `username/game` slug.
- Authenticate butler: run `butler login` (interactive) once, **or** provide the API key
  for a creds file (format confirmed at execution).
- Confirm `BUTLER_API_KEY` and the itch target are available to the build session.
*(If not provided, deployment cannot proceed — this is the critical-path gate.)*

**Step D1 — `<L>` `scripts/install-butler.sh`** (new file)
Download `https://github.com/itchio/butler/releases/download/v15.32.0/butler-linux-amd64.zip`,
extract to `.tools/butler/`, `chmod +x`. Idempotent. Verify: `.tools/butler/linux-amd64/butler --version`.

**Step D2 — `<S>` `.gitignore`** — add `.tools/` and `.holonovel-state/` (also closes
the Phase 1 gap). Verify: `git check-ignore .tools/butler/linux-amd64/butler` succeeds.

**Step D3 — `<S>` Authenticate** — `butler login` (or place the token file), then
`butler status <user>/<game>`; must list channels without auth error.

**Step D4 — `<M>` Deploy smoke test (placeholder).** Create a throwaway `build/index.html`
(a trivial "Holotron deploy OK" page — **not** a submission), then
`butler push build/ <user>/<game>:html5 --userversion 0.0.1-smoke`. Verify the build is
live at the itch URL. **This proves the critical path before any pipeline run.**

**Part B — Deferred until the game exists (after `PLAN_PHASE1.md` Step 5).**

**Step D5 — `<S>` Final push** — copy the real `index.html` into `build/` and
`butler push build/ <user>/<game>:html5 --userversion <ver>`; confirm the live game.

**Step D6 — `<M>` `deployment_agent.md` Linux fix** — add a Linux section: butler path
`.tools/butler/linux-amd64/butler`, auth via `butler login`/creds file, `butler status`
then `butler push build/ username/project:html5`; keep the Windows section intact; note
the `$BUTLER_API_KEY` wrapper caveat. Verify: `git diff` shows an added section only.

**Step D7 — `<S>` Upload log + commit** — write `butler-log.txt` (commands + results);
commit `scripts/install-butler.sh`, the `deployment_agent.md` edit, `.gitignore`, and the
`build/`+logs; push to the public fork. Update `PROCESS.md`.

**Fallback (D4-alt):** if the CLI path is blocked, use the **itch app** (bundles butler,
Builds page GUI) to push the same `build/` to the `html5` channel.

---

## 5. Verification

| Step | Verified by |
|---|---|
| D0 prereqs | itch project exists (HTML5); `butler login`/creds present |
| D1 install | `butler --version` prints `v15.32.0` from `.tools/` |
| D2 gitignore | `git check-ignore` on `.tools/` and `.holonovel-state/` |
| D3 auth | `butler status <user>/<game>` returns channels, no auth error |
| D4 smoke | placeholder build live at the itch URL (critical path proven) |
| D5 final push | real game live at the itch URL |
| D6 agent fix | additive diff only |
| D7 commit | fork updated; `butler-log.txt` present |

Satisfiability: D0 is user-gated (credentials/project) and is the only non-automatable
step; everything after is deterministic. If `butler login` cannot run headless, D4-alt
(the GUI) is the named substitute.

---

## 6. Edge cases & risks

| Case | Handling |
|---|---|
| `broth.itch.ovh` unreachable | GitHub release binary (verified) |
| No credentials / no itch project | **hard prerequisite (D0)** — user action; cannot proceed without |
| Creds-file format unknown | use `butler login`; confirm format in a spike before scripting |
| `html5` channel not configured | set on the itch game page (kind: HTML) |
| Zip layout nests `linux-amd64/` | install script targets the nested path; verify with `--version` |
| Network egress blocked | `butler login` needs itch.io; fallback = itch app on a networked machine |
| GLIBC/arch mismatch | binary already ran (`v15.32.0`); if a judge's box differs, use arm64/other asset |

---

## 7. User impact, sizing, rollback

- **User action required:** create/confirm the itch.io HTML5 project + credentials (D0).
- Sizing: D0 S (user) · D1 L · D2 S · D3 S · D4 M · D5 S · D6 M · D7 S.
- Rollback cost: **0–1** (install + docs are additive; a pushed build can be deleted/
  hidden on itch.io).

---

## 8. Relationship to the jam

This is the **critical path**: Phase 1+2 produces the game; Phase 3/4 is what makes it a
submission. If time runs short, **deployment outranks the Holonovel integration** — a
shipped, plainly-generated #7 game scores; an unshipped integrated one does not.
