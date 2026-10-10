# Roadmap

Forward plan for Holotron. Completed work lands in `CHANGELOG.md`; this file tracks what is
*next* and what is deliberately deferred. Cross-referenced from `PROCESS.md`.

## Done — Torre Nosferatu run (2026-10-10, `gameotron_output/20261010_095651/`)

- **B — Torre pipeline: DONE.** `gameotron` run executed with the theme override; mandatory
  approval gate fired (**user selected #14 "Dread Weather"**); `direction.txt` reached `gdd_agent`.
  Artifacts: `world_template.json`/`.txt`, `world_map.json`/`.txt`, `gdd.md`, `audio_direction.txt`,
  `visual_direction.txt`, `index.html` (2109 lines), review/runtime/Phase-2/juice reports, run log.
- **B7 gate: PASS.** `window.systemState()` at the pristine boot state returns a non-null `dread`
  clock `{0,0..8}` **and** all 5 NPCs; `window.social(id)` drives the UI handler (steal/warm logged);
  a `required_encounters` entry (`bats`) is reachable on `test_seed=20261010`; all 5 wave-3 flags
  toggle without gating the frozen hooks.
- **C5 end-to-end: DONE.** `scripts/check_template.mjs --fail-on spatial` on the real Torre artifacts
  on `test_seed` → **spatial 0, systemic 0, exit 0**. Control fixtures unchanged (golden 0/exit0;
  malformed 4 spatial/exit1; malformed_archetypes 3 spatial/exit1; malformed_systems 7 systemic/exit0).

## Next — deploy & submit (P5; user-gated)

- **D — Deploy.** Create the Torre itch.io project + join the jam (user action, P0.4), push
  `build/index.html` via butler on user confirmation, set Public, confirm the page resolves and the
  jam entry is in — **before 2026-10-11 12:00.**
- **C7 — Connectivity validation.** Still deferred: validate `connectivity.rules` (`"entry ->
  corridor*"`); the `*` grammar must be defined first.


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
