# PROCESS — How GAMEOTRON was used, configured, and improved

> Fill this in as the run progresses. This document is the "documented process"
> half of the valid-entry requirement: it must show what was done, why, and the
> measured effect. Cite evidence (commands, files, logs).

## 1. Summary

One paragraph: what Holotron is (GAMEOTRON fork + Holonovel world-model
integration), what game was produced, and the headline improvement.

## 2. How GAMEOTRON was used

- Entry point: `use @gameotron with theme: Anything Goes`
- Chosen concept (from the mandatory approval gate): <concept>
- Pipeline phases exercised and their outputs: <list with file paths>
- Log folder: `YYYYMMDD_HHMMSS/`

## 3. How GAMEOTRON was configured

- `opencode.json` — Holonovel MCP server mount (local command), scoped to `world_agent`.
- `theme_override` — used to bypass the network theme fetch.
- Any other configuration deltas from the base repo.

## 4. How GAMEOTRON was improved

### 4.1 world_agent (Design phase)

- What it does: authors the game world as Holonovel declarative assertions →
  `manage_world(convert)` validates it → exposes `world://map` → writes
  `world_map.txt` consumed by `gdd_agent`/`code_agent`.
- The additive orchestrator edit (gameotron.md) that invokes it.

### 4.2 Linux deployment

- `deployment_agent.md` changed from the Windows `.exe` + PowerShell path to a
  POSIX `butler` invocation; why; and the smoke-test evidence.

### 4.3 Reliability check

- The post-generation check tying the game back to `world://map`.

## 5. Before/after metric

| Metric | Baseline (no integration) | With integration |
|---|---|---|
| Invalid structures reaching `code_agent` (count) | <n> | <n> |
| (add others as measured) | | |

Method: <how measured>.

## 6. Reproduction

Steps to reproduce the run from a clean checkout.
