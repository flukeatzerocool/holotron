# Stress-Test Report: Deepen Holotron's Holonovel integration (Torre Nosferatu)

- Verdict: **NOT_READY** (revised after Outside Voice)
- Score: **64/100** (revised from 87)
- Questions asked: 9 (across 4 rounds) + 1 outside-voice review
- Dimensions covered: 7/7 assessed (6 questioned; Security/Risk assessed inline)
- Chosen approach: **Long-term path** — full systemic integration, behavioral (non-tautological) check, advisory severity

## Blast Radius

- **Agents (5):** `world_agent.md`, `code_agent.md`, `gdd_agent.md`, `puppeteer_agent.md`, `gameotron.md`.
- **New artifacts (3):** `scripts/check_template.py`, `world_template.schema.json`, `test_worlds/malformed_systems.json`.
- **Docs / contract (4):** `AGENTS.md`, `PROCESS.md`, `CHANGELOG.md`, `TORRE_NOSFERATU.md` §14.
- **Generated game contract:** `window.TEMPLATE` gains `resources`, `clocks`, `npcs`, `social_actions`, `encounter_roster`, `scene_types`, `lore`.
- **Not touched:** Holonovel source, `opencode.json`, deployment path.

## Biggest Pushback

The systemic check was circular as written (compared the game's state to the template it was built from). The user chose a behavioral UI-driven playthrough to fix it — but per the Outside Voice, playthrough fixes *reachability* tautology, not *constant-echo* tautology; the high-severity form of this remains open.

## High Severity

- [ ] **H1 — Sequencing is inverted.** Validation infra (steps 4-6) exists only to validate the wave-2 systems (steps 2-3), which the brief cuts at T-6h (`TORRE_NOSFERATU.md:220-222`). If wave 2 is cut, the infra is dead work. Sequence by shipping risk (game systems first, systemic validator last) or explicitly accept throwaway infra.
- [ ] **H2 — The "guaranteed reachable test encounter" has no representation in the contract.** `count:[min,max]` bounds don't force placement; `required_things` covers things, not encounters (`world_agent.md:70-85`). Needs a dedicated required-encounter/placement field or a test-only seed fixture. Compounded by authoring seed (`TTRPG_SEED`, `opencode.json:11`) being independent of runtime `window.SEED`, and `seed_default:null` — "fixed seed" pins sampling, not the LLM-authored data.
- [ ] **H3 — Non-circularity is not actually achieved.** A Dread hook that `code_agent` writes from the same template proves the UI path fired, not that Dread was gameplay-derived. Requires emergent invariants the template cannot echo (clamp, monotonic tiers, never-negative, tier→disposition coupling) **and** the systemic hook must call the *same handler the UI uses* (as `code_agent.md:20-22` mandates for `move`). The plan never states the latter.
- [ ] **H4 — The Holonovel dependency is unpinned / machine-local.** `scripts/holonovel-mcp.sh:12` hardcodes `/home/fluke/Holonovel-deployed/holonovel` with no commit pin. Deepening reliance without pinning breaks judge/contributor reproduction (`COMPLIANCE.md:25`, `PROCESS.md:116-124`) and lets the server change mid-jam. (Also: step 1's spike is near-certain to pass — it verifies tool *existence*, not the argument/readback shapes that actually broke before per `world_agent.md:51-59`.)

## Medium Severity

- [ ] **M1 — Controls prove rejection, never acceptance.** Both fixtures assert "≥2 mismatches"; a checker that rejects everything passes both. Add a **golden/positive fixture** and assert the real Torre template yields 0.
- [ ] **M2 — `world_template.schema.json` has no authority mechanism.** No generator, no CI (none exists), and the specified **stdlib** checker cannot validate JSON-Schema. Contract already drifted across 5 places including `PROCESS.md:92-93` (`window.WORLD`) vs `AGENTS.md` (forbids `window.WORLD`). Either add a wiring step or don't claim "single source."
- [ ] **M3 — Dead-data sections.** `lore` and `scene_types` (partly `encounter_roster`) are authored + schema'd but no check observes them. Add per-section assertions or cut them (YAGNI).
- [ ] **M4 — §14 amendment is a governance issue.** The brief says it "is **not** a GDD and **not** an implementation spec" (`TORRE_NOSFERATU.md:5-6`) and §14 is marked "(settled)." Who approves turning it into a machine-checked contract? A CHANGELOG entry is not review.
- [ ] **M5 — Template size / context budget.** `AGENTS.md` requires explicit file re-passing between phases; adding clocks/NPCs/relationships/roster/scene-types/**prose lore** inflates the artifact. No size cap → a truncated TEMPLATE silently drops systems while the game still boots.
- [ ] **M6 — Injection + portability.** New free-text `lore` is emitted into `<script>window.TEMPLATE=…</script>`; a `</script>`, `<!--`, or U+2028 breaks the single-file game. `check_template.py` assumes Python on the generation box (repo's other scripts are bash; deploy path is Windows).

## Low Severity

- [ ] **L1 — Attribution.** MIT notice/version trace for the deepened Holonovel dependency; `NOTICE`/`AUTHORS` credit GAMEOTRON only.
- [ ] **L2 — No falsifiable success definition.** State what distinguishes success from process theater (e.g., "checker rejects a systemic malformation AND the golden template yields a winnable game on the fixed seed").
- [ ] **L3 — Meta value question.** Since the game never calls Holonovel and validation runs on static JSON, the "world model" reduces to a JSON linter. A stronger demonstration: show `manage_relationship`/`manage_lore` *catch a contradiction* a human wouldn't.

## Unresolved

- [ ] H1 (sequencing), H2 (encounter representability), H3 (echo tautology / same-handler), H4 (pin the dependency).
- [ ] Playthrough reliability on floor 2-3 (medium).

## Well-Defended

- [x] Intent: process/validation is the point; full scope kept.
- [x] Gate severity: rooms hard, systemic advisory — protects the deadline.
- [x] Bounds: clamp + tier-transition assertions required.
- [x] Deadline affordance confirmed by the user.

## Outside Voice Findings

Fresh-context reviewer, asked "what did this review miss?" Full text drove H1-H4 / M1-M6 / L1-L3 above. Headlines:

1. The prior grill asked *"is the validation real?"* but never *"is the contract able to express what the plan promises, and is this the right thing to spend the remaining hours on?"*
2. Step 1's spike is near-certain to pass (tools + `tug_of_war` confirmed in deployed source) — it verifies the wrong risk; the real risk is **argument/readback shapes** (`world_agent.md:51-59` documents a prior deployed-vs-docs divergence).
3. **Sequencing**: systemic validation infra is built for a feature cuttable at T-6h, ungated on that feature shipping — the single most plan-changing omission.
4. The accepted "guaranteed encounter" mitigation has **no field to live in**.
5. UI playthrough fixes *reachability* tautology, not *constant-echo* tautology; and the systemic hook must call the same handler as the UI.
6. No positive fixture → "0 mismatches" is the only soundness evidence, confounded by #5.
7. The schema "single source" is aspirational without a generator/CI, and stdlib can't do JSON-Schema.
8. `lore` + `scene_types` are dead data.
9. The §14 amendment has a governance problem.
10. Template size vs explicit context-passing; lore injection into `<script>`; Python portability vs a Windows deploy path.
11. Attribution for the deepened MIT dependency.
12. No falsifiable success; the model may be no more than a JSON linter.

## Recommended Next Step

Do **not** build yet. Fold H1-H4 into the plan first (sequence game systems before systemic validator; add a required-encounter field/test seed; mandate the same-handler systemic hook + emergent-invariant assertions; pin the Holonovel dependency to a commit). Then resolve M1-M2 (golden fixture; decide schema authority or drop the claim), then re-run `plan-review` on the revised plan.
