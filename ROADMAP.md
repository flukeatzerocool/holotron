# Roadmap

Forward plan for Holotron. Completed work lands in `CHANGELOG.md`; this file tracks what is
*next* and what is deliberately deferred. Cross-referenced from `PROCESS.md`.

## Now — finish the Torre Nosferatu run

- **B — Run the Torre pipeline.** `use gameotron with theme: Torre Nosferatu — …`.
  User-driven; the orchestrator's approval gates apply.
- **B7 gate.** After implementation, confirm the social + Dread systems actually shipped:
  `window.systemState()` returns a non-null `dread` clock and ≥1 NPC, `window.social(id)`
  exists and calls the UI handler, and a `required_encounters` entry is reachable on
  `test_seed`. **Pass ⇒ unblocks C4/C5.**

## Next — wire and run the Phase 2 world-model checker (gated on B7)

- **C4 — Wire `puppeteer_agent.md`.** Phase 2: extract `{world, systems}` on `test_seed`;
  run `scripts/check_template.mjs`; rooms **hard**, systemic **advisory**; golden + both
  malformed fixtures; fail-closed rooms / report-unverified systemic.
- **C5 — End-to-end.** Run the checker against the real Torre artifacts on `test_seed`;
  record spatial = 0 and the advisory systemic count.

Built and dry-run, not yet wired: `scripts/check_template.mjs`,
`test_worlds/golden_template.json`, `golden_state.json`, `malformed_systems.json`.

## Deferred — Holonovel systems not needed for Torre

Intentionally out of scope (they add cost without serving the candle/Dread/NPC loop):

- `manage_belief` / perception ledger — NPC dispositions from witnessed acts.
- `manage_agent` durable NPC tasks + `TTRPG_WORLD_REACTIVITY` / `TTRPG_NPC_AUTONOMY`.
- `manage_condition` (spooked/snuffed), `manage_vow` (escape-as-vow), the causal transition
  ledger, the knowledge corpus, the build-time semantic index / knowledge graph, and the
  identity kernel.
- Game-side runtime Holonovel calls (the game is a static file and cannot reach the MCP).

Known build limitation: the pinned `manage_countdown` (`b6a182a`) has no `clock_type` and
cannot count up — Dread is authored as lore, not a clock (see `PROCESS.md` §4.4).
