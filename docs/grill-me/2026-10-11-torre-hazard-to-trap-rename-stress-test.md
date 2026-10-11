# Stress-Test Report: Torre Nosferatu — hazard→trap rename, puzzles cut, always-visible Orlok

- Verdict: READY_WITH_RISKS
- Score: 79/100
- Questions asked: 7
- Dimensions covered: 6/6
- Chosen approach: Modified path (canonical "trap" + migrate machine; density-scaled trap escalation; always-visible Orlok seated in the spill ring, with a pre-registered legibility falsifier)

## Blast Radius
- `TORRE_NOSFERATU.md` (the edited brief), `world_template.schema.json` (kind/role enums),
  `scripts/check_template.mjs` (placement invariant), authored templates
  (`gameotron_output/20261010_095651/world_template.json`, `test_worlds/`), `CHANGELOG.md`,
  and downstream agents: `world_agent`, `gdd_agent`, `visual_agent`, `audio_agent`, `code_agent`,
  `puppeteer_agent` (Phase 2 checker), `review_agent`.
- Customers: none external; single-file jam entry. Blast radius is the reproducibility of the
  contract between brief, schema/checker, and agent outputs.

## Biggest Pushback
- The rename hazard→trap was treated as prose-only, but the **machine word stayed `hazard`**:
  `world_template.schema.json:150` rejects `kind:"trap"` and `check_template.mjs:96` only treats
  `'creature'/'hazard'` as taxing. §6.1.1's claim "the checker asserts 'no required thing in a
  creature/trap room'" and §14's "asserted by check_template.mjs" were, post-rename, **false** —
  the load-bearing placement invariant silently no-ops.

## High Severity
- [ ] **Schema + checker drift.** Migrate `world_template.schema.json` enums
      (`encounter_roster.kind`, `required_encounters.kind`, `archetypes.role`) and the
      `'hazard'` literal in `check_template.mjs:96` (and its comment/error text) to `trap`;
      re-author any template using the old name. Until then the invariant the brief claims is
      unenforced. *(Decision: Approach A.)*
- [ ] **Orlok has no falsifier.** Add a pre-registered, hand-counted kill-criterion for
      always-visible Orlok (legibility test). *(Decision: pre-register a legibility test.)*
- [ ] **Orlok render seat.** §11 must state he is drawn against the **spill-ring floor
      (`#0a0708`) with a faint rim-light**, never in the pure-black void — eyes are accent, not
      the only read (preserves "shape+silhouette+red, never hue alone"). *(Decision: seat in
      spill ring.)*

## Medium Severity
- [ ] **6-traps/one-per-floor arithmetic.** Six traps, one per floor below the Spire, needs 7
      floors; the template has 6; the roster's own "First appears" column says two "early"/two
      "mid." *(Decision: drop one-per-floor for traps; escalate by density/region.)*
- [ ] **Lore "information" referent.** Puzzles cut removed the lever-hint referent. *(Decision:
      hints reveal floor/stair layout — key/refill/fast-stair location.)*
- [ ] **Spiders vs Spider web.** Both occupy doorways. *(Decision: spiders own doorways; the web
      trap moves to a different room context, kept as companion events — web near spiders,
      adjacent when possible.)*
- [ ] **role:"puzzle" remnant.** §14 seats the trap in a puzzle-role alcove while §6.1 says
      puzzles are cut. *(Decision: add `role:"trap"`, retire `puzzle` from role/kind enums, give
      the trap a trap-role archetype.)*
- [ ] **§6.3 blanket sentence.** "the dark hides them exactly as it hides everything else"
      contradicts always-visible Orlok. *(Decision: name Orlok as the explicit exception.)*
- [ ] **Companion-event enforcement.** Web-trap ↔ spider adjacency is a new generation-time
      spatial constraint. *(Decision: author it via world_agent and add a check_template.mjs
      adjacency assertion.)*

## Low Severity
- [ ] **CHANGELOG not updated.** The working-tree rename/cut is uncommitted and
      `CHANGELOG.md` still documents the *hazard* system and 5-hazard roster. Update per the
      `changelog-before-commit` skill before committing.

## Unresolved
- [ ] None blocking. All raised decisions were settled in-session; none are reflected in the
      file yet, so the brief is currently **inconsistent with the decisions made** until edited.

## Well-Defended
- [x] Trap placement invariant rationale (spanning-tree leaf, non-required room) — logically
      sound once the checker actually reads `kind:"trap"`.
- [x] Falling back trap escalation to the density axis removes the floor-count and budget
      collision cleanly.
- [x] Lore → floor/stair hint gives the cut-puzzles change a coherent information reward.
- [x] Companion events keep the spider/web fiction legible while removing doorway ambiguity.

## Recommended Next Step
1. Apply the six High/Medium decisions to `TORRE_NOSFERATU.md`, `world_template.schema.json`,
   `scripts/check_template.mjs`, and the templates in one coherent edit.
2. Update `CHANGELOG.md`.
3. Run `plan-review` against the revised change set before committing (multi-file, touches the
   world contract + schema — a plan gate applies).

## Verdict
`grill-me READY_WITH_RISKS. Torre hazard→trap rename + always-visible Orlok — 79/100, 0 unresolved high`
