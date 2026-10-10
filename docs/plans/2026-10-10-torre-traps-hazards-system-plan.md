# Plan: Torre Nosferatu — develop traps & hazards into a hazard system

Status: **Executed (verified)** · Date: 2026-10-10 · Goal owner: human
Source grill: `docs/grill-me/2026-10-10-torre-traps-hazards-system-stress-test.md`

## Goal

Promote §6.4 "Puzzles / traps / simple platforming" from a flat obstacle list into a coherent,
**turn-and-light hazard system** in the creative-direction brief (`TORRE_NOSFERATU.md`), with a
data-driven roster the world template can carry — **without a new player verb, without turning
the brief into a GDD, and with no structural schema change.**

## Scope

- **In:** `TORRE_NOSFERATU.md` (§5, §6.4, §8, §9, §12, §14, §15);
  `world_template.schema.json` (**one additive enum value only** — see D10);
  `CHANGELOG.md`.
- **Out:** Holonovel source; `opencode.json`; `scripts/check_template.mjs` (already validates
  encounter ids + reachability — no change); any new player verb; deployment path.

## Decisions locked

| # | Decision | Chosen | Rejected — why |
|---|---|---|---|
| D1 | Trap scope | Typed hazard roster, **no new verb** | Detection verb (probe/search) — adds input surface, breaks tap-to-move + calm pacing (§13) |
| D2 | Cost grammar | **avoid = wax** (detour); **spring = snuff + match** | Wax-only spring cost — duplicates creature cost, ignores the match economy |
| D3 | No-match snuff | Enter §8 **guttering-dark grace** (same terminal path as wax-out) | Instant hard death — contradicts §5/§8/§6.4/§15 + beginner rule |
| D4 | Taxonomy | **hazard / puzzle / movement** | One bucket — erases the schema's `role:hazard` vs `role:puzzle` distinction |
| D5 | Blind crossing | Snuff pre-scouts a **memory shadow** (safe tiles faintly lit a few turns; still tap-adjacent) | Tap-into-black — a luck test, violates "turn-and-light, not reflex/luck" |
| D6 | Placement | Hazard **never on a cut-edge, by construction**; Phase 2 re-checks reachability | Generate-then-repair (extra pass); fixed hazard rooms (no variety) |
| D7 | Telegraph | **Intrinsic, spill-ring-visible** before entry (crack / glyph glow / dust) | Adjacency-only (too late); sound-first (breaks SFX-off play) |
| D8 | NPC × hazard | **Persistent + emergent** (NPCs can reroute a floor), **flag-gated** | Cosmetic-only (hollows §15 wave-3); disposition disarm/re-arm (scope creep) |
| D9 | Roster size | Define **5 hazards**, data-driven via `encounter_roster` | 2 (thin); 1 (under-delivers on "a system") |
| D10 | Template representation | Hazard **rooms** = archetype `role:"hazard"` (exists); hazard **instances** = `encounter_roster` entries. `kind` = **add `"hazard"`** to the two `kind` enums (additive, doc-only) | Reuse `kind:"puzzle"` — semantically false vs D4; reuse `kind:"creature"` — hazards are static (zero schema change if forced) |
| D11 | Falsifier | **A branch becomes dominant** (testers always avoid, or always spring) → cut/tune | — |

## Part A — `TORRE_NOSFERATU.md` (brief; direction, not spec)

- **A1 [M]** §6.4 — retitle **"Hazards, puzzles & movement"**; state the three classes; phrase the
  principle precisely as *"a wrong answer costs light, never an instant death — at worst it enters
  the guttering-dark grace, the tower's one terminal path (Orlok)"* (reconciles "never a life" with D3).
- **A2 [M]** New **§6.4.1 Hazards (the trap system)** — the cost grammar (D2); states
  **armed → sprung**, persistent (§6.5); intrinsic spill-ring telegraph (D7); **memory-shadow**
  blind crossing (D5); **no-match snuff → guttering-dark grace** (D3); **never on a cut-edge**
  placement rule (D6); NPC **persistent/emergent, flag-gated** interaction (D8); the pre-registered
  falsifier (D11).
- **A3 [S]** New **§6.4.2 Puzzles** — lever/door + glyph-routing: **route/solve, never snuff**;
  reachability guaranteed; a hint reachable via lore/information (§5.1); distinguishes the lever
  from the exit **Key**.
- **A4 [S]** New **§6.4.3 Movement** — platforming as **scout/commit** reconnaissance, grid
  one-tile, never a reflex test.
- **A5 [M]** New **§6.4.4 Hazard roster** — a descriptive table of 5 types
  *(Collapsing floor · Light-sensitive glyph · Pressure plate · Cursed ward · Crumbling stair)*
  with columns **Trigger · Avoid branch · Spring branch · Telegraph · First appears**; fields map
  to `encounter_roster` (`threat`/`effect`/`floor`). Direction, not numeric tables. Every type
  carries a **depth-first-appears** (A8) distinct from its **build-wave** (A11).
- **A6 [S]** §5 **Matches** — note the double duty (creature-snuff recovery + hazard crossing); add
  the **no-match → grace** rule (D3).
- **A7 [S]** §8 — a snuff is recoverable **provided a match is held**; otherwise it enters the
  **guttering-dark grace**, the same terminal path as wax-out (§8). Reconciles the zero-match case.
- **A8 [S]** §9 — rename "trap frequency" → **hazard density**; add **one new hazard per floor**
  (mirror §7's one-new-creature rule); a **single shared per-floor escalation budget** for
  creatures + hazards; house **"dark rooms"** as an environment modifier.
- **A9 [S]** §12 — add **trap audio cues** (stone grind, mechanism click, glyph tone), attenuated
  outside the radius, and a **snuff cue distinct from guttering** (consistent with §8).
- **A10 [S]** §14 — add hazards to the roster prose + mapping (D10): rooms `role:"hazard"`,
  instances in `encounter_roster`; state the checker already covers encounter ids + reachability.
- **A11 [S]** §15 — hazard must-haves (cost grammar, no-cut-edge, telegraph); **build-wave** staging:
  **wave 1 = collapsing floor** (must-have); **wave 2 = the remaining hazard types** by density
  (light-glyph, pressure plate, cursed ward, crumbling stair); **wave 3 = NPC tripping (flag-gated)**.
  (Depth-first-appears per type is A8; this is the delivery axis.)
- **A12 [S]** Pre-registered hazard falsifier in §6.4.1, in the §5.1 style (D11).

## Part B — Schema (doc-only, additive)

- **B1 [S]** `world_template.schema.json` — add `"hazard"` to the `kind` enum of both
  `required_encounters` (`:60`) and `encounter_roster` (`:150`). Additive enum value; the schema is
  documentation, `check_template.mjs` does **not** branch on `kind` (verified `:200-205`) → no
  checker ripple. If the enum change is unwanted, fall back to `kind:"creature"` (D10 alt).

## Part C — Change control

- **C1 [S]** Update `CHANGELOG.md`, date-stamped bullets, per the `changelog-before-commit` skill.
  No `ROADMAP.md` row references traps (verified by grep) → no register update.

## Dependency order

A1 → A2..A5 (the §6.4 rewrite in one pass) → A6..A12 (consistency patches, independent) → B1 → C1.
No circular dependencies; A6–A12 may be authored in any order.

## Verification

1. `grep TORRE_NOSFERATU.md` — no stale **"trap frequency"**; **"never a life"** retained with the
   grace caveat; every new §-ref resolves (§8/§9/§12/§14/§15).
2. Constraints untouched: `≤3 hues`, `375 px`, touch + mouse — spot-read §11/§13.
3. `git diff --stat` — `TORRE_NOSFERATU.md` + `world_template.schema.json` (enum lines only) +
   `CHANGELOG.md`; confirm `scripts/check_template.mjs` unchanged.
4. Brief stays **direction**: the hazard roster is descriptive, not a numeric table.
5. **Unverified until a pipeline run** — actual hazard generation + Phase 2 encounter coverage on
   `test_seed` (spatial hard, systemic advisory). Flagged, not claimed.

## Rollback

Prose + one doc-enum edit under git; fully reversible (rollback cost **1**). No runtime, data, or
dependency state touched. `git checkout` reverts.

## Risks

- **[MED] New hazard behaviours under-specified.** "Pressure plate" / "cursed ward" are new types.
  *Mitigation:* A5 defines all five against the same field set (trigger/avoid/spring/telegraph/depth).
- **[LOW] NPC mutated hazard state.** D6 largely defuses this: if every hazard is off the
  cut-edge at generation, springing one cannot sever the graph — the bypass remains, so an NPC
  springing a hazard only lengthens the route (wax), never strands. *Residual:* A2 still states the
  no-new-cut-edge invariant explicitly, and the feature is flag-gated (§15), so a flaky AI degrades
  gracefully rather than breaking the build.
- **[MED] Hazard × creature escalation collision.** Both ride §9's "one variable per floor".
  *Mitigation:* A8 gives them one shared per-floor budget.
- **[LOW] Brief tipping into spec.** *Mitigation:* roster stays descriptive; numbers live in the GDD.

## Success criteria

- §6.4 is a **three-class system** with a data-driven 5-hazard roster; grammar, placement,
  telegraph, NPC interaction, and the falsifier are all stated as **direction**.
- **No contradiction** with §5/§8/§9/§12/§14/§15; the brief still validates against §15 must-haves.
- **Zero structural schema change** (one additive enum value); the brief remains
  GAMEOTRON-generatable; wave-1 (NPC tripping cut) still ships a coherent candle-descent game.
