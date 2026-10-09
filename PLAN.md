# Holotron — Build Plan

**Jam:** Gameotron Game Jam · **Window:** Oct 9 2026 10:00 → Oct 11 2026 12:00 · **Mode:** solo, ~12–24 focused hours
**Mandate:** Fork GAMEOTRON, integrate Holonovel, and submit a **valid entry** — a playable browser game generated through GAMEOTRON, **plus** a documented process of using/configuring/improving it.

## 1. Objective & validity

A valid entry requires **both**:

1. A playable browser game **generated through GAMEOTRON**.
2. A **documented process** showing how GAMEOTRON was used, configured, or improved.

The mandated phase order and the **mandatory ideation approval gate** are preserved; the orchestrator is modified **additively only**. (The jam explicitly permits *adapting* GAMEOTRON, so an additive fork remains a valid "generated through GAMEOTRON" entry.)

**Done-bar:** *A playable `index.html` produced through a GAMEOTRON run whose phase order and approval gate are intact, whose game world is authored as Holonovel assertions, validated by `manage_world(convert)`, and post-generation-checked against `world://map`; plus a public GitHub fork and a `PROCESS.md` with one before/after metric.*

## 2. Approach (decided)

**Thin adapter.** Fork GAMEOTRON only; mount Holonovel as an **MCP server** and expose it to **one** new agent. No monorepo merge. Integration is **additive** and **design-time**.

- **Wedge:** Holonovel **world model** at the Design phase, via `manage_world(action: convert)` with **authored assertions** (`generate` is ruleset-free content-absent — verified, REQ-431b).
- **Reliability proof:** a post-generation check tying the game back to `world://map` — without it the reliability claim is cosmetic.

## 3. Preconditions & environment

- OpenCode installed; Node 24+; git.
- **Linux Butler** on `PATH`; `BUTLER_API_KEY` in env; itch.io account + project created; jam joined.
- Holonovel server runnable (repo builds; `dist/` + `bin/` present).
- **Project root:** `/home/fluke/Holotron` (all work lives here — nothing under `/home/fluke/Holonovel`).

## 4. Deliverables

1. `holotron` — public **GitHub** fork of GAMEOTRON (PolyForm Noncommercial license + `Required Notice:` preserved).
2. Modified pipeline: `opencode.json` (MCP mount), `.opencode/agents/world_agent.md`, and an additive edit to `.opencode/agents/gameotron.md` invoking it.
3. Generated `index.html` meeting all baseline requirements.
4. `PROCESS.md` — use/configuration/improvement narrative + one before/after metric.
5. Published artifacts: GDD, visual/audio directions, review/runtime/test/juice reports, process logs.
6. itch.io entry submitted before cutoff.

## 5. Compliance matrix

| Jam requirement | Satisfied by | Status |
|---|---|---|
| Playable browser game generated through GAMEOTRON | Phase 0 baseline run; phase order + approval gate intact | planned |
| Documented process (used/configured/improved) | `PROCESS.md` + public fork + artifacts | planned |
| Single `index.html`, vanilla JS | GAMEOTRON output | verify Phase 0 |
| Mouse + touch, responsive, finger targets | GAMEOTRON output | verify Phase 0 |
| ≥6 screens: Title, Pause, How to Play, Gameplay, Settings, Game Over/Victory | GAMEOTRON output | verify Phase 0 |
| Pause + settings music/SFX toggles | GAMEOTRON output | verify Phase 0 |
| Mandatory approval gate | GAMEOTRON orchestrator | preserve |
| "Share improvements on GitHub" | public fork | Phase 4 |
| License (PolyForm NC) | README + notices | Phase 0 |

## 6. Execution plan

**Phase 0 — Baseline is the gate (4–8h)** · *exit: one `index.html` on disk*
- Fork GAMEOTRON → `holotron` (done: cloned into project root).
- Add skeleton `README.md` lineage, `PLAN.md`, `PROCESS.md`, `COMPLIANCE.md`.
- Run `use @gameotron with theme: Anything Goes`; clear the approval gate.
- Verify every baseline requirement against the file.
- **Checkpoint:** no `index.html` → stop integration, submit baseline.

**Phase 1 — Integration (6–10h)** · *exit: world validated and handed off*
- Add `opencode.json` with Holonovel as a local MCP server; scope its tools to `world_agent` only.
- Add `.opencode/agents/world_agent.md` at Design: `set_badge(game_master)` → `manage_novel(create)` → `manage_world(convert)` (assertions authored from the selected concept) → read `world://map` → write `world_map.txt`. **One `convert` per fresh Novel** (re-convert ⇒ `STATE_CONFLICT`).
- **Edit `.opencode/agents/gameotron.md`** to invoke `world_agent` in the Design phase (additive; phase order + approval gate untouched).
- Orchestrator passes `world_map.txt` to `gdd_agent`/`code_agent` (agents don't share state).

**Phase 2 — Reliability check (2–3h)** · *exit: game matches map*
- `puppeteer_agent` asserts the game's rooms/objects match `world://map`.
- Record metric: invalid structures caught before `code_agent`.

**Phase 3 — Deployment fix (2–3h)** · *exit: `butler status` green*
- Edit `deployment_agent.md` for Linux: `butler` on PATH, POSIX `&&`, remove `.exe`/PowerShell.
- Smoke-test `butler status` + throwaway `butler push` to a test project.

**Phase 4 — Submission (2–3h)** · *exit: entry live*
- Collect artifacts; finish `PROCESS.md`; publish to public GitHub (git.gay optional mirror).
- Upload HTML5 (Butler; manual zip fallback) before **Oct 11 12:00**.

## 7. Risk register

| Risk | Mitigation |
|---|---|
| Baseline never completes | Phase 0 first; checkpoint; T-6h ships baseline |
| `convert` gating/first-call friction | Prototype the 4-call cycle before wiring the agent |
| `code_agent` ignores `world_map.txt` | Explicit file handoff + Phase 2 check |
| `code_agent` 0-retry abort | Documented resume-at-phase; keep prompt tight |
| Butler auth/target failure | Manual itch.io upload fallback |
| Time overrun | Timebox Phase 1; integration is stretch after Phase 0 |

## 8. Definition of Done

- [ ] Public GitHub fork; license + notices preserved
- [ ] `@gameotron` run with phase order and approval gate intact
- [ ] `index.html` meets all baseline requirements
- [ ] `world_agent` integrated additively + consistency check passes
- [ ] `PROCESS.md` + before/after metric
- [ ] Pipeline artifacts published
- [ ] itch.io entry submitted before cutoff

## 9. Open items

- Create the itch.io project and set `BUTLER_API_KEY`.
- Create the public GitHub repo (`gh repo fork` / `gh repo create`) when authorized.

## 10. Next gate

Run Phase 0 baseline (OpenCode session: `use @gameotron with theme: Anything Goes`), then Phase 1.
