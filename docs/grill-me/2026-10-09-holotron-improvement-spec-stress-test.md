# Stress-Test Report: Holotron improvement-spec submission

- Verdict: READY
- Score: 82/100
- Questions asked: 10
- Dimensions covered: 6/6 (Premise, Assumptions, Feasibility, Edge Cases, Security/Risk, Maintainability, Scope)
- Chosen approach: Minimal path (modified)

## Premise

The jam's improvement half requires (a) a documented process of using/configuring/
improving GAMEOTRON and (b) a shared documented fork. The decided shape:

- **`PROCESS.md` is the submission** for the improvement half.
- **`HOLOTRON.md`** is a standalone, contract-style spec of the fork's deltas, written
  in Holonovel's voice (what, not how). **No writes into the Holonovel repo.**
- **Torre Nosferatu** is the game (staged MVP brief; Rule Breaker is the integration
  test harness, never the submission).
- A full Holonovel-spec increment (new REQs + Tnnn tests + Appendix E/F + registers) is
  a **post-deadline stretch**, not in scope.

## Blast Radius

- **Repos:** `fork → flukeatzerocool/holotron` (public), `origin → gameotron/gameotron`.
- **Docs:** `PROCESS.md` (reframe), `TORRE_NOSFERATU.md`, `PLAN_TORRE_NOSFERATU.md`,
  new `HOLOTRON.md`; `COMPLIANCE.md` unchanged.
- **Agents:** `gameotron.md` (additive), `world_agent.md`, `gdd_agent.md`,
  `code_agent.md` (world contract), `deployment_agent.md`.
- **Config:** `opencode.json` (Holonovel MCP), `scripts/holonovel-mcp.sh`.
- **Upstream:** gameotron maintainers *if* they choose to integrate.
- **Deadline:** Oct 11 2026 12:00.

## Biggest Pushback

The plan originally placed a heavyweight spec **port into the Holonovel register** on
the critical path for the improvement half. Pre-scan showed that register is
12,870 lines / 1,165 REQs behind conformance gates (`assemble` + `check:fast`,
Appendix E/F, register checks) — and the act of writing into it **violates the plan's
own hard constraint** ("nothing written under `/home/fluke/Holonovel*`"). It also spent
scarce pre-cutoff hours on a mandatory game half that had not run yet. Demoted to a
standalone, gate-free `HOLOTRON.md`.

## High Severity

- [x] **IMP-4 was assumed to be a Holonovel capability.** `REQ-431`
      (`manage_world generate`) instantiates *only* ruleset generation tables; it
      returns *content-absent* ruleset-free, and the implementation (`index.ts:3415`)
      is a stub chamber-chain. Resolved: **procgen lives in the game**; `world_agent`
      authors a static **template** (archetypes + legal connectivity + roster) via
      `convert`; Phase 2 validates a fixed-seed layout against it.
- [x] **World contract broke under procgen.** `code_agent.md`'s "embed
      `world_map.json` verbatim as `window.WORLD`" cannot hold for a generated world.
      Resolved: emit `world_template.json` → `window.TEMPLATE`, seed from
      `window.SEED`, expose `window.worldState()` (generated graph) + `window.move(dir)`.
- [x] **`code_agent` (0 retries) vs Torre's feature load.** Resolved: **staged MVP
      brief** — floor-1 core (candle, wax/matches/key/exit, one creature, seeded floors)
      ships first; social/Dread are wave 2, consistent with §9's "floor 1 stays wax and
      exploration only."
- [x] **Phase 2 had no oracle for a seeded world.** Resolved: **constraint checker**
      at a pinned seed (archetypes present, connectivity legal, required things placed);
      Rule Breaker's 1:1 graph check stays as the sensitivity control.

## Medium Severity

- [x] **PROCESS.md evidenced the wrong game.** Reframed: Rule Breaker = test harness
      (evidence for IMP-1..3), Torre = submitted run; one metric table covers both.
- [x] **No nameable submission fallback.** Resolved: best **Torre** build + documented
      known-issues; never substitute another game.
- [ ] **Integrator audience was speculative.** Settled: optimize for jam judges;
      integrator-readiness is a bonus, not the design driver.

## Low Severity

- [ ] HOLOTRON.md scope drift risk — bounded to shipped deltas only (IMP-1..4 + revised
      contract + additive edits), each with evidence + metric.

## Unresolved

- [ ] Full Holonovel-spec port (REQs/tests/appendices/registers) — deferred; owner and
      date not set. Acceptable for the jam.

## Well-Defended

- [x] License preserved (`PolyForm NC` + notices) — `LICENSE.md`.
- [x] No secrets in repo; butler creds via `~/.config/itch/butler_creds`.
- [x] Hermetic Holonovel state (`.holonovel-state/` gitignored; launcher sets
      `TTRPG_DATA_DIR`).
- [x] Fork edits additive; phase order + approval gate intact.
- [x] Kill criteria named: **T-6h cut line** (drop wave-2 if no playable build);
      **fail-closed** Phase 2 (absent hook ⇒ *unverified*, not passed).

## Recommended Next Step

1. Write `HOLOTRON.md` at root — REQ-style blocks for IMP-1..4 + the revised world
   contract, each with evidence and a before/after metric.
2. Reframe `PROCESS.md` (Rule Breaker = harness; Torre = submission).
3. Run the staged Torre pipeline; pause at the mandatory approval gate.
4. Then `plan-review` the Holotron spec + PROCESS reframe before Build.

## Outside Voice

Not run (optional). Say the word and a fresh reviewer will look for what this grill
missed.
