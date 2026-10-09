# Holotron — Phase 1+2 Build Plan (Holonovel integration + reliability check)

**Status:** DRAFT (revised per grill-me report `docs/grill-me/2026-10-09-phase1-stress-test.md`) —
awaiting `plan-review` + user confirmation before execution.
**Scope:** Mount the Holonovel world-model as an MCP server, add one `world_agent`
at the Design phase, wire it additively into the GAMEOTRON orchestrator, and add a
Phase 2 game↔world consistency check. Deployment is planned separately in
`PLAN_DEPLOY.md` (critical path).
**Role in the submission:** this integration is proven on **#7 "Rule Breaker Dungeon"**
(the integration vehicle, already deployed). The jam **submission game is Torre
Nosferatu** (`TORRE_NOSFERATU.md`), which reuses this integration with a **template +
seeded procgen** variant.
**Mode boundary:** PLAN is read-only. BUILD starts only on user confirmation.

---

## 0. Execution order (critical path)

Deployment is **mandatory**; the Holonovel integration is **optional upside**. Sequence
so the submission path is proven before the expensive pipeline run:

1. **D0 (user, start now):** create/confirm the itch.io **HTML5** project + run
   `butler login` (`PLAN_DEPLOY.md` D0). Only you can do this; it may need back-and-forth.
2. **Deploy smoke test** (`PLAN_DEPLOY.md` D1–D4): install butler, authenticate, `push` a
   **placeholder** `build/index.html`, confirm the live URL. ~30–60 min. Proves the
   critical path with a fixture (not a submission).
3. **Step 0 spike (§4):** validate server boot, scoping, `read_mcp_resource`, and the
   convert cycle.
4. **Single decision point:**
   - Spike **passes** → run **#7 once WITH `world_agent`** (Steps 1–5), then Phase 2 (Step 6).
   - Spike **fails** → kill criterion → run **plain #7 (no `world_agent`)**.
5. **Final push** (`PLAN_DEPLOY.md` D5): re-push the real build; then Phase 2 + commit/docs.

There is **one #7 run**, not two. A Phase 1+2 problem must never block the deploy smoke
test, and the smoke test must never be treated as the submission.

---

## 1. Objective & done-bar

**Objective.** Make the generated game's world authored and *validated* by
Holonovel, and *demonstrate* that the generated game matches it — so "the world is
reliable" is evidenced, not asserted.

**Concept.** The integration vehicle is **#7 Rule Breaker Dungeon** (grid rooms + exits +
things → a literal spatial world the Holonovel world model can represent). This
**replaces #20 The Everything Button**, which has no spatial world; the Everything
Button build is abandoned (user decision, grill-me). #7 is the **integration proof**
(already deployed); the jam **submission game is Torre Nosferatu** (`TORRE_NOSFERATU.md`). Its run artifacts in
`gameotron_output/` are retained as historical process evidence.

**Done-bar (Phase 1+2 exit).** On a fresh GAMEOTRON run whose phase order and
approval gate are intact:
1. `world_agent` authors the dungeon world as Holonovel assertions; `manage_world(convert)`
   returns `[OK] World model populated`.
2. `world_map.json` (machine-readable: rooms / exits / things) **and** `world_map.txt`
   (human summary) exist in the run folder and are non-empty.
3. `gdd_agent` and `code_agent` were handed the world artifacts; `code_agent` embeds
   the world as `window.WORLD` per the canonical contract (§4.5).
4. `puppeteer_agent` runs the Phase 2 check by **driving the game** (real input) through
   every declared exit and comparing the *observed* room graph to `world_map.json` —
   not by re-reading the embedded JSON. **Mismatch count is reported**; target 0. A
   non-zero count is fed to `bugfix_agent` (not a pipeline abort).
   A **control fixture** (a deliberately malformed world) must produce ≥2 mismatches,
   proving the check has teeth.
5. Only `world_agent` can call Holonovel tools (scoping proven, or a documented
   fallback applied).

Phase 2's "green" is **mismatch = 0 after the bugfix loop**, not a one-shot gate.
Phase 3 (Linux deploy) and Phase 4 (upload) are planned in `PLAN_DEPLOY.md` (critical
path) and must not be dropped — a green Phase 1+2 submits nothing on its own.

---

## 2. Verified facts (evidence)

| Fact | Evidence |
|---|---|
| Global config defines `mcp.holonovel` (`enabled:false`) → `/home/fluke/Holonovel-deployed/holonovel` (tsx + `src/index.ts`) | `~/.config/opencode/opencode.json` |
| MCP local shape: `{type:"local", command:[...], environment:{}, enabled, cwd?, timeout?}` | `https://opencode.ai/config.json` → `McpLocalConfig` |
| Per-agent `permission` accepts arbitrary tool-name keys; top-level `"*"` wildcard valid | `AgentConfig`/`PermissionConfig`; opencode permissions docs |
| OpenCode exposes MCP **resources** via `read_mcp_resource` | opencode issue #35720; v2 resource-catalog API |
| Holonovel sequence: `set_badge(game_master)` → `manage_novel(create[,switch])` → `manage_world(convert, source=…)` → read `world://map` | `holonovel/scripts/test-backfill.ts:340-380`; `src/world/model.ts:145-241`; `src/index.ts:2820,3406,8259` |
| `convert` DSL: markdown `## Room: <slug>`+body, or `<Name> is a room. "<desc>".`, exits, things | `src/world/model.ts` `convertSource`; test `T244` |
| Ruleset-free is fine for `convert`; `generate` is content-absent ruleset-free | REQ-431b; AGENTS.md |
| Holonovel v2026.10.09; deployed tsx + src present; deployed state already holds user codex/novels | `ls`, `package.json` |

---

## 3. Decisions (with alternatives)

| Decision | Chosen | Alternatives rejected |
|---|---|---|
| Concept | **#7 Rule Breaker Dungeon** (world-bearing) | #20 (no world → vacuous Phase 2); #16 (levels ≠ rooms, awkward) |
| Integration scope | **Phase 1 + Phase 2 bundled** | Phase 1 alone (cosmetic — the reliability claim would be unproven) |
| Mount mechanism | OpenCode **MCP** local server via project `opencode.json` | shell-out to CLI (weaker config story); vendor library (merge cost) |
| Server target | `HOLONOVEL_DIR` env var (documented default), repo wrapper script | hardcoded absolute path (not reproducible for the fork) |
| Data dir | project-local `.holonovel-state/` (gitignored) | deployed default dir (pollutes user state); source repo dir (violates "no writes under /home/fluke/Holonovel") |
| World production | `convert` with authored assertions | `generate` (content-absent ruleset-free) |
| World proof | **behavioral traversal**: puppeteer drives the game and compares the *observed* room graph to `world_map.json`, plus a malformed control fixture | re-reading the embedded JSON (tautological — tests file copy); prose-only `world_map.txt` (cosmetic) |
| Scoping | top-level permission denies `holonovel_*` + `read_mcp_resource`; `world_agent` re-allows | leaving all 30 tools exposed (context bloat) |
| Submission fallback | **none** (user-overridden) | keep the finished Everything Button as insurance (rejected by user) |
| Metric | single-run proxy: convert warnings + Phase 2 mismatch count | two-run A/B (doubles cost); qualitative only |

---

## 4. Steps

**Step 0 — Spike (gate). Timebox 45–60 min. All downstream steps depend on it.**
- **S1 server boots:** wrapper starts the MCP stdio server without error.
- **S2 tool names:** throwaway project `opencode.json` enabling `holonovel`; restart
  opencode; list registered tool names (confirm `holonovel_` prefix).
- **S3 scoping:** confirm `permission: {"holonovel_*":"deny"}` matches tool names.
  Fallback: generated enumerated deny-list of the 30 tool names.
- **S4 resource read:** confirm `read_mcp_resource` returns `world://map` after a
  convert. Fallback: `manage_novel(export)` → extract world into `world_map.json`.
- **S5 cycle:** `set_badge(game_master)` → `manage_novel(create)` →
  `manage_world(convert, source="## Room: hall\nA hall.")` → read map, end-to-end.
*Kill criterion:* if S1/S5 fail with no ≤1h fix, **skip the integration entirely** and
produce the submission via the **plain GAMEOTRON run for concept #7 (no `world_agent`,
no Holonovel)** plus the Linux deployment plan (`PLAN_DEPLOY.md`). Skipping the
integration does **not** restore #20 — #7 must be built either way. (The abandoned
Everything Button is *not* the fallback.)

**Step 1 — `<L>` Wrapper `scripts/holonovel-mcp.sh`**
Resolves `HOLONOVEL_DIR` (default documented; override via env), sets
`TTRPG_DATA_DIR=${TTRPG_DATA_DIR:-<repo>/.holonovel-state}`, `TTRPG_SEED=holotron`,
`TTRPG_GAME_ID=default`; ensures the data dir exists; `exec`s tsx on the server entry.
Verify: clean stdio start; repo not written under `/home/fluke/Holonovel`.

**Step 2 — `<M>` Project `opencode.json`**
- `$schema`, `mcp.holonovel` (local, `command:["bash","scripts/holonovel-mcp.sh"]`,
  `cwd:"."`, `enabled:true`).
- `permission`: `{"*":"allow","holonovel_*":"deny","read_mcp_resource":"deny"}`.
- `agent.world_agent.permission`: allow `holonovel_*` + `read_mcp_resource`.
Verify: opencode starts; denied agent cannot see holonovel tools.

**Step 3 — `<L>` `.opencode/agents/world_agent.md`**
Frontmatter: `description`, `mode: subagent`, `permission`. Body:
- Inputs: `selected_concept.txt`, `concepts_with_review.txt`.
- Exact sequence: `set_badge(game_master)` → `manage_novel(create[,switch])` →
  `manage_world(convert, source=<authored DSL>)` → `read_mcp_resource world://map`.
- The `convert_source` DSL grammar + a worked dungeon example.
- **Emits BOTH** `world_map.json` (machine-readable: `rooms[]`, `exits[]`, `things[]` —
  parsed from the converted world/export) **and** `world_map.txt` (human summary).
- Failure: `STATE_CONFLICT` → fresh Novel; empty/invalid world → **one retry with a
  fresh Novel**, then write an empty-marker and report failure (loud degrade, §6).
- `generate` is forbidden (content-absent ruleset-free).
Verify: appears post-restart; one manual invocation produces both files.

**Step 4 — `<S>` Additive `gameotron.md` edit**
In **Phase 3 Design**, before `gdd_agent`: "Use `world_agent` to author and validate
the dungeon world from the selected concept; pass `world_map.json`/`world_map.txt` to
`gdd_agent` and `code_agent`." Phase order + approval gate **untouched**. Also `<S>`
update `AGENTS.md` (agent list + data-flow row).

**Step 4.5 — `<S>` World contract (canonical schema; referenced by gdd/code agent prompts)**
`world_map.json` (emitted by `world_agent`) and the game's `window.WORLD` use ONE
schema, keyed by room **slug** (canonical — removes all id/name/slug ambiguity):

```json
{ "seed": 0, "start": "<slug>",
  "rooms": { "<slug>": { "name": "<display>", "exits": { "<dir>": "<slug>" },
                          "things": ["<thing-slug>"] } } }
```

`code_agent` MUST embed this verbatim as `window.WORLD`, MUST use it as the single
source of truth for level generation, and MUST set `window.WORLD.current = "<slug>"` on
every room transition. Slug is the normalization owner. This is the "tie the game to
the map" contract; **Phase 2 verifies behavior, not bytes.**

So Phase 2 can traverse deterministically without pixel-hunting, `code_agent` MUST also
expose `window.move(dir)` that invokes the **same transition handler the UI uses** (a
thin hook, not a parallel code path). The checker calls `window.move(dir)` and reads
`window.WORLD.current` — exercising real game logic, not the static JSON.

**Step 5 — Restart + end-to-end run (single #7 run)**
User restarts opencode (config/agent load). Per the §0 decision point, run the #7 pipeline
**once** — from the approval gate through code/review/bugfix/juice, **with `world_agent`
at Design if the spike passed, otherwise plain #7**. Verify done-bar §1.1–1.3.

**Step 6 — `<M>` Phase 2 behavioral consistency check (anti-tautology)**
`puppeteer_agent` (extended task) loads the game and, using **real touch+mouse input**,
traverses the dungeon from `window.WORLD.start` through every declared exit; after each
move it reads `window.WORLD.current` and records the observed transition. It asserts:
(i) every declared room is reachable; (ii) every observed transition matches a declared
exit; (iii) no undeclared transitions/rooms. Report a **mismatch count** + list. If >0,
hand to `bugfix_agent` and re-check (≤3 cycles).
Then run the **control fixture** `test_worlds/malformed.json` (a dangling exit to a
missing room + a disconnected room) against a minimal harness exposing it as
`window.WORLD`: it must yield **≥2 mismatches**, proving the check detects errors
rather than parroting the file. Record the metric (§7).

**Step 7 — `<S>` Commit + push**
Commit Phase 1+2 (new files + additive edits + wrapper) and the #7 run artifacts
(including `world_map.json`, `world_map.txt`, the Phase 1 run log, the Phase 2 test
report). Push to the public fork. Update `PROCESS.md` §3/§4 + metric row.

**Resume-at-phase (recovery path).** If `code_agent` (0 retries) aborts, re-enter the
pipeline at the failed phase reusing the run's `gdd.md`, `audio_direction.txt`,
`visual_direction.txt`, and world artifacts — do not restart from Phase 1.

---

## 5. Verification

| Step | Verified by |
|---|---|
| 0 Spike | manual wrapper run; opencode tool list; scoping assertion; `read_mcp_resource` result |
| 1 Wrapper | server starts; no writes under `/home/fluke/Holonovel` |
| 2 config | opencode starts (schema valid); denied agent lacks holonovel tools |
| 3 world_agent | appears post-restart; produces non-empty `world_map.json` + `.txt` |
| 4 orchestrator | `git diff` additive-only; phase order + gate present |
| 4.5 contract | `code_agent` output contains `window.WORLD` matching `world_map.json` |
| 5 e2e | done-bar §1.1–1.3 from the new run folder |
| 6 Phase 2 | behavioral-traversal mismatch count == 0 after ≤3 bugfix cycles; control fixture yields ≥2; metric recorded |
| 7 commit | `git push` succeeds; fork updated |

Satisfiability: Phase 2 is deterministic **given** the contract; if `code_agent` omits
`window.WORLD`, Phase 2 reports "contract not met" as a finding (not a crash) and the
bugfix loop addresses it. The e2e run requires a human at the approval gate and one
opencode restart — both named as user-impact steps.

---

## 6. Edge cases & failure handling

| Case | Handling |
|---|---|
| MCP scoping globs unsupported | enumerated deny-list fallback (S3) |
| `read_mcp_resource` absent in 1.18.35 | `manage_novel(export)` fallback (S4) |
| `convert` returns `STATE_CONFLICT` | create a fresh Novel, one retry |
| World still empty/warning-laden after retry | **one retry with fresh Novel, then loud degrade**: proceed without usable world, mark run **failed** on done-bar §1.1–1.3 (never silent) |
| `code_agent` aborts mid-run | resume-at-phase path (§4) |
| Phase 2 mismatch > 0 | feed list to `bugfix_agent`, re-check (≤3 cycles) |
| Orchestrator (subagent) cannot spawn `world_agent` | invoke from the main agent (as the baseline run did); `gameotron.md` documents the step |
| Server writes into Holonovel repo | project-local `TTRPG_DATA_DIR`; wrapper default off `/home/fluke/Holonovel` |
| Config breaks opencode startup | `OPENCODE_DISABLE_PROJECT_CONFIG=1`; change is one new file |

---

## 7. Metric, risks, rollback

**Metric (single run + control).** Report three numbers:
(a) **design-time** — `convert` structural warnings (world errors caught before `code_agent`);
(b) **runtime** — observed-vs-declared mismatches from the behavioral traversal (target 0);
(c) **control** — mismatches from the malformed fixture (must be ≥2), demonstrating
sensitivity. All reproducible from the run folder. (This supplies the "Baseline
(no integration)" column `PROCESS.md` §5 lists, via the control fixture.)

| Risk | Mitigation |
|---|---|
| **No game fallback (accepted)** | resume-at-phase path; if the spike fails entirely, produce a plain (no-`world_agent`) run + Linux fix — never the abandoned Everything Button. Residual risk retained by user |
| Integration value modest (structure only) | the proxy metric must show a gain or the "improvement" claim is stated qualitatively |
| Time overrun (~46h) | Step 0 timebox; Step 1–4 before any rerun; resume-at-phase |
| Fork reproducibility | env-var wrapper + published artifacts (judges can read the mechanism) |

**Rollback cost: 1** (new files deleted; additive `gameotron.md`/agent edits reverted;
git revert of the Phase 1+2 commit).

---

## 8. User impact & change sizing

- **Restart required** after Steps 2/3 for config + agent registration; again after any
  config edit.
- **Approval gate:** you must be present for the #7 run's concept gate.
- Sizing: Step 0 M · 1 L · 2 M · 3 L · 4 S · 4.5 S · 5 M · 6 M · 7 S.
- No destructive operations; nothing written under `/home/fluke/Holonovel`.

---

## 9. Related plans

- **`PLAN_DEPLOY.md` (critical path):** Linux Butler install + `butler push` upload, and
  the `deployment_agent.md` Linux fix. A green Phase 1+2 submits nothing without it.
- **Phase 4:** final `PROCESS.md`, description/tags, retry/deploy log.
