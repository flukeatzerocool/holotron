# Stress-Test Report: Torre Nosferatu — traps & hazards → system

- Verdict: READY_WITH_RISKS
- Score: 74/100
- Questions asked: 12
- Dimensions covered: 6/6 (premise, assumptions, feasibility, edge cases, scope; security n/a)
- Chosen approach: Typed hazard roster, no new verb — data-driven via `encounter_roster`

## Blast Radius

- Files: `TORRE_NOSFERATU.md` §6.4 (rewrite), §5, §8, §9, §12, §14, §15 (patches).
  `world_template.schema.json` needs **no change** (`role:hazard`/`puzzle`,
  `encounter_roster.kind:puzzle`, `threat`/`effect`/`floor` already exist).
  `scripts/check_template.mjs` needs **no change** (validates encounter ids + reachability).
- Downstream: `world_template.json`, `gdd.md`, `index.html` generator + turn engine.
- Systems touched: procgen floor graph, turn/wax engine, match economy, NPC sim (wave 3), audio.
- Players: a beginner on the Spire must never be trappable to death.

## Decided (premise + dimensions)

- Scope: **typed hazard roster, no new verb** (preserves calm, turn-and-light pacing).
- Cost grammar: **avoid = wax** (detour burns turns); **spring = snuff + match**.
- No-match snuff = **enter the guttering-dark grace of §8**, never an instant hard death.
- Taxonomy: **hazard** (avoid/spring) vs **puzzle** (route/solve, never snuff) vs **movement** (scout/commit).
- Blind crossing: **snuff pre-scouts a memory shadow** — still tap-adjacent, no new verb.
- Placement: **never on a cut-edge, by construction** — every hazard bypassable.
- Telegraph: **intrinsic, spill-ring visible** before commitment (renders with SFX off).
- NPC × hazard: **persistent + emergent** (NPCs can reroute a floor), **flag-gated** for graceful degradation.
- Roster: **expand to 4–5 hazards**, carried as `encounter_roster` data.
- Falsifier: **a branch becomes dominant** (testers always avoid, or always spring) → cut/tune.

## High Severity

- [x] None unresolved — the zero-match-snuff contradiction with §5/§8/§6.4/§15 was caught and reconciled.

## Medium Severity

- [ ] **New hazard types are un-specified.** "Expand to 4–5" needs each type's trigger, avoid
      branch, spring branch, telegraph, and persistence defined, or the roster is a list of names.
- [ ] **NPC × hazard persistence can strand the player.** The cut-edge guard is generation-time
      only; an NPC springing a hazard post-boot can sever a route with no repair. Needs an
      NPC-mutation safety rule and a flag.
- [ ] **Hazard × creature escalation collision.** Both are hazards and both are budgeted under
      §9's "one new variable per floor". Without a shared budget, a floor can double-escalate.

## Low Severity

- [ ] "Dark rooms" (§9 escalation variable) is still unhoused in the taxonomy.
- [ ] Lever/door vs Key need a stated distinction; lever needs a reachability hint (lore/info, §5.1).
- [ ] §12 has no trap audio cues (stone grind, mechanism click, glyph tone).

## Unresolved

- [ ] Per-floor hazard energy/tempo budget (count, turn cost).
- [ ] The exact 4–5 hazard types.

## Well-Defended

- [x] Cost grammar is coherent and schema-representable today.
- [x] Zero-match terminal case reconciled with §8/§15 beginner rule.
- [x] Placement can never sever the floor graph by construction.

## Recommended Next Step

- Draft the §6.4 rewrite + §5/§8/§9/§12/§14/§15 patches (contracts, not prose), run `plan-review`,
  then switch to Build to apply.

```
grill-me READY_WITH_RISKS. Torre traps/hazards→system — 74/100, 0 unresolved high
```
