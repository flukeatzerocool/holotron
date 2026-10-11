# Stress-Test Report: Jam-requirements enforcement strictness

- Verdict: READY
- Score: 86/100
- Questions asked: 5
- Dimensions covered: 7/7
- Chosen approach: Modified path (keep Phase 1 + gate; hard-stop after polish; doc edits)

## Subject

User claim: the Gameotron jam requirements were interpreted more loosely than the
pipeline has been enforcing — (1) themes optional because "Anything Goes",
(2) no obligation to pick from the 20 concepts, (3) no auto-upload; playtest first.

Sources checked: itch.io `gameotrongamejam` page; GitHub `gameotron/gameotron` README.

## Evidence found

- **Theme:** itch.io says *"This Week's Theme is: Anything Goes."* "Anything Goes" is the
  official theme, not theme-lessness. Overrides are explicitly endorsed ("provide a theme override").
  Challenge line: *"transform the official jam theme into a playable browser-game concept."*
- **Gate:** BOTH sources call the ideation approval gate **mandatory**. Jam page:
  *"after concepts are generated and reviewed, the user chooses the concept before development continues."*
  README: *"Generate 20 game concepts"* + *"Mandatory user approval gate."*
  Softener in user's favor: *"20 ideas you can choose from **or adapt**."*
- **Upload:** already gated. README: *"the user always confirms before any upload runs."*
  Jam step 6: *"Play, rate, and improve the game until you are satisfied."* `AGENTS.md` Phase 6: user confirms first.
- **Escape hatch:** jam rewards *"a documented process showing how GAMEOTRON was used, **configured**, or **improved**."*

## Blast Radius

- Files: `.opencode/agents/gameotron.md` (Phase 1, Phase 2, Phase 6), `AGENTS.md` (Phase table, gotchas),
  possibly `.opencode/agents/deployment_agent.md`. Doc-only. No runtime, data, or external systems.
- Teams/customers: none. Single maintainer, single-machine pipeline.

## Biggest Pushback

Your premise was **half-right**: the *game content* can be anything, but the 20-concept ideation
and the approval gate are documented as **mandatory pipeline behavior**, not agent over-enforcement.
"Anything Goes" constrains content, not the pipeline. When pinned to an operational choice you
correctly kept Phase 1 and kept the gate — so the loose reading, once made concrete, does not
contradict the jam. The residual risk is only if the gate were silently dropped and a judge read
the process log against the jam page.

## High Severity

- (none)

## Medium Severity

- [ ] **Two-file drift.** Both `AGENTS.md` and `.opencode/agents/gameotron.md` encode the pipeline.
  A hard-stop / theme-note change must land in both or they will disagree (log says "mandatory gate"
  in one, "adaptable" in the other). Decide the single source of truth before editing.
- [ ] **"Hard stop" contract is undefined.** `gameotron.md:41-43` says deployment_agent "prepare and deploy,"
  then asks confirmation. "Hard stop after polish" needs a concrete contract: where control returns,
  what artifact is handed back (`gameotron_output/<ts>/index.html`), and how a later deploy run is invoked.

## Low Severity

- [ ] Your CHANGELOG convention (`changelog-before-commit` skill) applies to any instruction edit.
- [ ] Holotron fork must not disturb the pinned Holonovel MCP wiring in `opencode.json` / `scripts/`.

## Unresolved

- [ ] Whether `deployment_agent` should still *prepare* `build/` assets at the hard stop, or defer
  everything until an explicitly-requested deploy run. (User picked hard-stop; prep behavior unspecified.)

## Well-Defended

- [x] Keep Phase 1 with "Anything Goes" (or override) — matches both sources.
- [x] Keep the approval gate, allow adapting the 20 concepts — matches "choose from or adapt".
- [x] No auto-upload — already the documented rule; nothing to change.
- [x] Playtest-before-submission intent — aligned with jam step 6.

## Recommended Next Step

Switch to Build mode and make three surgical instruction edits:

1. `gameotron.md` Phase 1 — note the official theme may be "Anything Goes"; override is sanctioned.
2. `gameotron.md` Phase 2 — note the reviewed concepts are a pool to choose from **or adapt**.
3. `gameotron.md` Phase 6 — split deployment into a separate, explicitly-requested run; end the
   default pipeline at Phase 5.5 and hand back `gameotron_output/<ts>/index.html` for playtest.
   Mirror the same in `AGENTS.md`. Then update `CHANGELOG.md` before committing.

No unresolved high-severity issues. Safe to proceed.
