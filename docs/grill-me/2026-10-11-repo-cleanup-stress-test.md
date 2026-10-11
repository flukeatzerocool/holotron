# Stress-Test Report: Repo cleanup for publication

- Verdict: READY_WITH_RISKS
- Score: 80/100
- Questions asked: 7
- Dimensions covered: 7/7
- Chosen approach: Modified path (track both game copies; narrow 004054 deletion; document canonicity)

## Blast Radius
- Repo: Holotron (fork `flukeatzerocool/holotron`). Tracked-file set changes; `.gitignore`
  semantics change; one run partly pruned. No runtime, no services, no data stores.
- Consumers: itch.io submission, GitHub readers of the "documented process" half.

## Biggest Pushback
- `build/index.html` re-tracking **reverses a deliberate one-day-old decision** (`e1ce51d`
  removed it and gitignored `build/`, message: "butler deploy output is now gitignored") and
  duplicates `20261011_095532/index.html` (both md5 `bf7657…`). The user chose to keep both;
  drift mitigation is documentation-only (see Medium).
- The `.opencode/` cleanup **already ran once** (`e0b0b4d`) and the files regenerated — because
  opencode reinstalls its plugin deps. It will recur.

## High Severity
- (none unresolved)

## Medium Severity
- [ ] **build/ vs run-artifact drift.** Two tracked copies of the same game, produced by
      different paths, no binding. User resolved by declaring `build/index.html` canonical and
      `20261011_095532/index.html` "frozen evidence" (documentation only — no equality guard).
      Accepted risk; a future run can silently advertise a stale build.
- [x] **004054 over-deletion.** Only `index.html` duplicated
      `095532/index.pre-update.html`; the run's 5 audio reports + state are unique and cited by
      `CHANGELOG.md`. Resolved: delete only the duplicate `index.html`, keep the rest.
- [x] **095532 temp-artifact dangling refs.** Run logs/buglists cite
      `index.pre-update.html`, `index.update.diff`, `rollback/index.live.html`. Resolved: keep them.

## Low Severity
- [x] **Changelog scope.** `e0b0b4d` (prior cleanup) did not touch `CHANGELOG.md`. Resolved:
      minimal entry covering only the versioned-state change (build/ tracking + run removals).

## Unresolved
- (none)

## Well-Defended
- [x] Reversible throughout — all changes are `git checkout`-able (rollback cost 1).
- [x] Kept `docs/plans/` + `docs/grill-me/` as referenced process evidence.
- [x] Kept root `.gitignore` npm guards as the durable replacement for the deleted
      `.opencode/.gitignore`.
- [x] Accepted opencode scratch regenerates; root `.gitignore` is the durable guard.

## Recommended Next Step
- Apply the revised plan (restore 004054 minus `index.html`; no 095532 temp deletions; add
  canonicity note documenting `build/index.html` as canonical; minimal changelog line), then run
  `plan-review` before the commit.
