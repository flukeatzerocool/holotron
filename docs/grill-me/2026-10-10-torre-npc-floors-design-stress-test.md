# Stress-Test Report: Torre Nosferatu — NPC roster & descent/floor model

- Verdict: **READY_WITH_RISKS**
- Score: **70/100** (premise settled; several high spec gaps to close in the plan)
- Questions asked: 11 (5 clusters) + 1 outside-voice review
- Dimensions covered: 7/7 (Premise, Assumptions, Feasibility, Edge Cases, Security/Risk, Maintainability, Scope)
- Chosen approach: **Modified path** — brief carries direction; mechanics live in `world_template.json`/`gdd.md`

## Blast Radius

- **Brief / docs:** `TORRE_NOSFERATU.md` (§1 logline, §6.3 social, §8 win/loss, §9 progression, §14 world contract, §15 staged delivery), `COMPLIANCE.md` (workflow-integrity checkbox).
- **Pipeline / agents:** `gameotron.md` (data-flow, approval gate), `gdd_agent.md` (brief input + acceptance checklist), `world_agent.md` (NPC roaming/recurrence), `code_agent.md` (multi-floor, `down`/`up` exits, NPC movement, encounter trigger), `puppeteer_agent.md` (Phase 2 NPC reachability).
- **Contract:** `world_template.schema.json` — **unchanged** (floor-agnostic retained).
- **Generated game:** gains a 5-floor descent, 5 roaming survivors, floor persistence, per-depth escalation.
- **Not touched:** Holonovel source, `opencode.json`, deployment path.

## Biggest Pushback

The design escalated three times in one conversation — from *social encounters*, to *roaming agents*, to *shared-resource simulation* (NPCs attacked, tripping traps, taking/using items). Each is more expensive than the last; the second and third are the largest systems in the game. The grill's core win was **staging them** (social agents wave-2, shared-resource sim wave-3) so the shippable game never depends on the biggest system — but the outside voice showed the pipeline has **no channel to carry the brief's constraints into the GDD**, so a "compliant" run can ship a game that violates the brief undetected.

## High Severity

- [ ] **H1 — No brief→GDD channel.** `gdd_agent` inputs are the concept + template only; `TORRE_NOSFERATU.md` is never passed to it and no acceptance test checks the GDD contains the must-haves (one refill/floor, ≤25% wax-social budget, Spire isolation, five poles). A compliant run can ship a violating game. **Plan closes this.**
- [ ] **H2 — Floor persistence undefined.** "Stepping regenerates the active floor" clashes with key/NPC-drop continuity and the `up` exit: per-visit reseed loses a dropped key; per-depth needs a memory model. Unspecified ⇒ softlock or incoherent map. **Plan decides: memoize per `(seed, depth)`.**
- [ ] **H3 — Approval gate meaning undefined.** The brief pre-locks the concept (candle-clock, roster, Dread), so the 20 generated concepts either converge on it (the human's choice is theater) or diverge (approving one voids the locked design). COMPLIANCE's workflow-integrity checkbox is unverifiable. **Plan defines the gate's object.**
- [ ] **H4 — NPC count contradiction.** Brief §6.3/§15 say **four** NPCs; the locked decision is **five**. The checker constrains no NPC count. world_agent/GDD/code diverge. **Plan amends to five.**
- [ ] **H5 — Per-floor escalation is prose-only and untested.** The template is floor-agnostic; the checker validates ONE active floor. Nothing verifies per-depth density/drain/darkness or winding-floor pacing — the tower can be flat or unplayable by depth and pass every gate. Accepted risk (systemic is advisory) — flagged, not machine-gated.

## Medium Severity

- [ ] **M1 — Precedence undefined** between the brief, `gdd.md`, and `world_template.json` where numbers (wax pool, Dread tiers, budget) live in more than one. `code_agent` silently picks one on conflict.
- [ ] **M2 — Encounter-trigger path untested.** Checker and puppeteer drive `window.social(id)` directly, bypassing the roaming/co-location that actually opens encounters. Tested path ≠ played path; roaming determinism has zero coverage.
- [ ] **M3 — Wave-2 cut vs. authored template.** world_agent authors npcs/social/dread at Design, before the T-6h cut; a wave-1 build still embeds them and the advisory systemic checks pass. The "single source" misrepresents the shipped game.
- [ ] **M4 — Dread dual-authored** (template `clocks[]` + Holonovel `dread-dial` lore) with no tie; the checker reads only the template. Holonovel's "validated world" is decorative for the signature dial.
- [ ] **M5 — Escape paradox.** If a roaming NPC escapes and "the door is left open," does the player still need the key? Yes ⇒ the open door is cosmetic; no ⇒ §8's key/exit loop is bypassed. Decide explicitly.
- [ ] **M6 — Snuff vs. guttering dark** both render as darkness but one is recoverable, one terminal. Unreadable state ⇒ unfair deaths. Visual/audio must distinguish.
- [ ] **M7 — Dread 4–5 "warm acts cost an extra turn"** collides with the ≤25% wax-social cap and "Dread never hard-locks": at Hunted, atonement can be wax-unaffordable. Cold runs could soft-lock.

## Low Severity

- [ ] **L1 — Zone-Bonus renumbering.** "First entry to each new floor" needs restating for descent (there is no "floor 1" ascending).
- [ ] **L2 — NPC-roaming simulation cost** in a single vanilla-JS file: 5 agents + creatures + traps + items, all seeded-deterministic for the Phase 2 check. Wave-3 only.

## Unresolved

- [ ] H2 (floor persistence model) and M5 (escape → door-open semantics) are the two decisions the plan must settle before code.
- [ ] H1/H3/H4 are resolved by plan steps; H5 accepted as advisory.

## Well-Defended

- [x] Premise: direction-in-brief boundary preserves the "generated through GAMEOTRON" compliance requirement.
- [x] Wave sequencing: descent core wave-1, social+Dread wave-2, shared-resource sim wave-3 — the shippable game never depends on the biggest system.
- [x] No race fail-state: key recoverable (dropped on NPC death) or door left ajar — Orlok stays the only death, honoring §8/§15.
- [x] Budget numbers: ~5–8 min, ~75–100 turns, wax ~30, ≤25% warm spend, one exchange/NPC/floor.
- [x] No schema change: floor-agnostic template retained.

## Outside Voice Findings

Fresh-context reviewer (asked "what did this review miss?"). Full text drove H1–H5 / M1–M7. Headlines:

1. The brief pre-locks the concept, so the mandatory approval gate risks being theater — *what is the human actually deciding?*
2. The brief says four NPCs; the design says five — nothing constrains NPC count.
3. No channel carries the brief into the GDD; no acceptance test checks the must-haves landed.
4. Per-floor escalation has no representation and no gate — the tower can be flat and pass.
5. "Regenerate the active floor" contradicts key/NPC-drop continuity — the persistence model is missing.
6. The tested encounter path (`social(id)`) bypasses the roaming co-location that opens encounters.
7. Authoring social/Dread at Design means a wave-1 cut still embeds a template the game doesn't use.
8. The escape-paradox: an NPC-opened door either makes the key cosmetic or bypasses the win loop.
9. Snuff (recoverable) and guttering dark (terminal) render identically — unfair deaths.
10. Dread 4–5's "warm acts cost an extra turn" can make atonement wax-unaffordable — a soft-lock.

## Recommended Next Step

Fold H3/H4/H1 and the two open decisions (H2 floor persistence, M5 escape semantics) into the brief-amendment plan, with an explicit brief→GDD channel and a GDD acceptance checklist. Then run `plan-review` on the revised plan before Build.

---

## Resolution — second pass (2026-10-10)

Focused re-grill on the two open decisions (H2, M5), informed by prior-art research
(roguelike persistence, extraction-game objective semantics).

### H2 — floor persistence (RESOLVED)

- **Model:** generate each floor once from `floorSeed = hash(masterSeed, depth)`; cache the
  object and mutate it in place. Mutations are a **delta layer**, not part of the seed's output.
- **Phase-2 check:** validates the **pristine boot state** — `worldState()` at boot (pre-mutation)
  equals `regenerate(test_seed)`; the checker validates archetype roles + `count` bounds there
  (exactly what `check_template.mjs` already does). Mutated runtime state is not bit-compared.
  Closes the internal tension in the original recommendation (determinism held only at boot).
- **Off-floor simulation:** **active-floor-only** — NPCs advance only on the floor the player
  occupies; off-floor survivors hold position ("elsewhere", not frozen in lore). Deterministic
  by construction; global simulation deferred to wave 3.

### M5 — escape semantics (RESOLVED, user-modified)

- **Window:** when an NPC escapes through the exit, it holds the door open for **N turns**, where
  **N = f(NPC disposition toward the player, current Dread)**. Warm/Allied + low Dread ⇒ long
  window; Hostile/high Dread ⇒ brief or no window. This wires the social layer into the endgame.
- **Cost:** the ajar path is a **lesser ending** ("you slipped out in another's wake") with a
  **score penalty** vs the key path's full victory; **and** the open door **raises Dread / draws
  monsters near the exit** while it stands open.
- **Key remains** the self-reliant, reliable path; Orlok stays the sole death.
- **Wave-2-cut fallback:** if the social layer is cut, the window defaults to a fixed turn count.

### Severity updates

- H2, M5 → resolved. M6 (snuff vs guttering) resolved in A4. H1/H3/H4 resolved by plan steps.
- **New [MED]:** the ajar-window mechanic makes the social layer **load-bearing for the endgame**;
  the wave-2-cut fallback (fixed window) is required so a wave-1 build still resolves the door.
- Re-scored: **85/100, 0 unresolved high → READY.**
