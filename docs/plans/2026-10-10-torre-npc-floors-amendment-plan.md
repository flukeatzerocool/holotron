# Plan: Torre Nosferatu — 5-survivor roster & 5-floor descent into the brief + pipeline

Status: **Approved (plan-review passed)** · Date: 2026-10-10 · Goal owner: human
Source grill: `docs/grill-me/2026-10-10-torre-npc-floors-design-stress-test.md`

## Goal

Fold the locked design — **five recurring, roaming survivors** and a **descending, winding,
generated tower** — into the human creative-direction brief (`TORRE_NOSFERATU.md`) and the
GAMEOTRON pipeline, **without** turning the brief into a GDD and **without** a schema change.

## Scope

- **In:** `TORRE_NOSFERATU.md`; `gameotron.md`; `AGENTS.md`; `gdd_agent.md`; `world_agent.md`;
  `code_agent.md`; `puppeteer_agent.md`; `world_template.schema.json` (doc-only note);
  `ROADMAP.md`; `CHANGELOG.md`.
- **Out:** Holonovel source; `opencode.json`; deployment path; `world_template.schema.json`
  structure (no keys added).

## Decisions locked

| Decision | Chosen | Rejected — why |
|---|---|---|
| Where the roster lives | Brief = direction; mechanics in template/GDD | Full spec in brief — breaks the GAMEOTRON-generated boundary (M4) |
| Floors in the template | Floor-agnostic template | `floors[]` schema change — ripples through checker/AGENTS/world_agent on a jam clock |
| NPC simulation depth | Staged: social agents wave-2, shared-resource sim wave-3 | Full shared-resource sim in wave-2 — biggest system behind a T-6h cut (H1) |
| Rival outcome | No fail-state | Race fail-state — violates §8/§15 "Orlok only death" |
| Floor persistence (H2) | Generate once from `hash(seed, depth)`; cache + mutate; **checker validates pristine boot state**; active-floor-only NPC sim | Per-visit reseed — loses dropped keys, incoherent map |
| Escape semantics (M5) | Escaped NPC holds the door open **N turns, N = f(disposition, Dread)**; ajar path = **lesser ending + score penalty** and **raises Dread / draws monsters**; key = full-victory path; **fixed-count fallback if social cut** | Key-required-only (rival payoff lost); full race (reintroduces fail state) |

## Part A — `TORRE_NOSFERATU.md` (brief; direction, not spec)

- **A1 [S]** §1/§2 — reframe escape as a **descent**: wake at the *Spire* (top), work down to the
  **ground floor** front door. Replace ascending "floor 1" language.
- **A2 [M]** New **§6.5 "The Tower"** — floors generated from the floor-agnostic template; **winding
  graph, not a stack** (multiple stairwells, loops, occasional tier-skipping stairs); stairs are
  `down`/`up` exits; **persistence: generate each floor once from `hash(seed, depth)`, cache and
  mutate in place; mutations are a delta**; **NPCs simulate active-floor-only**; run budget
  (~5–8 min, ~75–100 turns, wax ~30, one guaranteed refill room/floor).
- **A3 [M]** §6.3 — **four → five** NPCs; add the five survivors as **named personalities +
  temptation poles only**: Vlask (hoarder), Sister Marta (archivist), Ilona (bitten), Petr
  (innocent), Nadja (rival tomb-robber). No deltas/mechanics.
- **A4 [M]** §8 — key is **recoverable** (NPC drops on death); an escaped NPC holds the exit door
  open **N turns, N = f(disposition toward the player, Dread)**; the ajar path is a **lesser ending
  + score penalty** and **raises Dread / draws monsters near the exit** while open; the key is the
  full-victory, self-reliant path; Orlok stays the **sole death**; distinguish **snuff (recoverable)
  vs guttering dark (terminal)**; **if the social layer is cut, the window defaults to a fixed
  turn count**.
- **A5 [M]** §9 — restate progression for descent (Spire = no-social tutorial floor); fix the Dread
  4–5 "warm acts cost an extra turn" clause so atonement never becomes wax-unaffordable.
- **A6 [S]** §14 — no schema change; `down`/`up` stairs; `worldState()` reports the active floor;
  per-floor escalation lives in the GDD; Dread dual-authored (template `clocks[]` + lore).
- **A7 [S]** §15 — staged delivery → **wave 1 = descent core; wave 2 = social + Dread; wave 3 =
  shared-resource NPC sim**.
- **A8 [S]** New Handoff note — the brief is an explicit constraint source for the GDD.

## Part B — Pipeline / agents

- **B1 [M]** `gameotron.md` + `AGENTS.md` data-flow — run folder gains `direction.txt` (the brief),
  passed explicitly to `gdd_agent`; **define the approval-gate object** (human chooses among
  on-theme concepts; the brief constrains but does not pre-select).
- **B2 [M]** `gdd_agent.md` — brief as input + **GDD acceptance checklist** (refill/floor, Spire
  isolation, five poles, ≤25% warm budget, descent, wave staging).
- **B3 [S]** `world_agent.md` — `npcs[]` stays flat; recurrence is game-side roaming;
  `required_encounters` pins ≥1 reachable NPC on `test_seed`; template stays floor-agnostic.
- **B4 [M]** `code_agent.md` — multi-floor gen from `hash(seed, depth)`; `down`/`up` exits;
  **cache-and-mutate + expose a pristine boot hook** for the checker; **active-floor-only NPC
  simulation**; encounter on same-room co-location; **ajar-window = `f(disposition, Dread)` with a
  fixed-count fallback** when social is absent.
- **B5 [S]** `puppeteer_agent.md` Phase 2 — pin `test_seed` with ≥1 reachable NPC; validate the
  **pristine boot state**; note the co-location trigger.
- **B6 [S]** `world_template.schema.json` — **no structural change**; add a doc note to
  `x-runtime-state` (stairs `down`/`up`; floors cached/mutated; checker reads boot state).

## Part C — Change control

- **C1 [S]** Update `ROADMAP.md` (B7/C5 wording) and `CHANGELOG.md` (date-stamped bullets) before
  commit, per the `changelog-before-commit` skill.

## Dependency order

A → B (agents cite amended brief sections) → C. A1–A8 can be authored in one pass; B items are
independent of each other. C last, immediately before commit.

## Verification

1. **Part A** — manual read against the five must-haves; `grep TORRE_NOSFERATU.md` for:
   `four`→`five`, `floor 1`→`Spire`, and the wave wording updated.
2. **Part B** — confirmed by the next pipeline run + Phase 2 checker on `test_seed`:
   0 spatial mismatches, ≥1 NPC reachable, pristine boot state reproduces `regenerate(test_seed)`.
   *Unverified until the run* — flagged, not claimed.
3. **Part C** — changelog dated/bulleted; `ROADMAP.md` B7/C5 wording consistent.

## Rollback

All changes are prose/spec edits under git; fully reversible (rollback cost **1**). No runtime,
data, or dependency state is touched.

## Risks

- **[MED] Social is now load-bearing for the endgame.** The ajar-window `f(disposition, Dread)`
  requires the fixed-count fallback so a wave-1 (social-cut) build still resolves the door — made
  an explicit `code_agent` branch (A4/B4).
- **[MED] Per-floor escalation remains prose-only/untested.** Accepted: systemic is advisory;
  not machine-gated (H5).
- **[MED] Encounter trigger vs. checker.** Phase 2 drives `social(id)` directly, bypassing roaming
  co-location; add a co-location assertion or accept as advisory (M2).

## Success criteria

- Brief states the descent + 5 named survivors + ajar-door rule as **direction**, with no
  mechanical tables (keeps the GAMEOTRON-generated boundary).
- A wave-1 build (social cut) remains a coherent, shippable candle-descent game.
- `test_seed` run: 0 spatial mismatches, ≥1 NPC reachable, boot state reproducible.
