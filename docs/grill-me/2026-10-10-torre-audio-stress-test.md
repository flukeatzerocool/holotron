# Stress-Test Report: Torre Nosferatu audio fix plan

- Verdict: READY_WITH_RISKS
- Score: 78/100
- Questions asked: 6
- Dimensions covered: 6/6
- Chosen approach: Modified path (re-voice + bus routing + theme + offline verification)

## Blast Radius
- Code / Data / Customers: `gameotron_output/20261010_095651/index.html` (single,
  self-contained, client-side); deploy copy `build/index.html` (regenerated).
- Docs / Registers: `audio_direction.txt` mixer targets, `buglist_105719.txt`,
  `CHANGELOG.md`. No services, no data stores, no backend, no user data.

## Biggest Pushback
- The plan fixed the wrong symptom. The original premise was the
  master-gain-after-death mute; the user's actual experience was *near-silence
  from turn 1 with only menu-click "static"*. The death bug is latent, not the
  reported failure. Root cause is the audio direction's own loudness targets
  (~-34 dB, "edge of hearing") implemented faithfully, plus a 38 Hz-only drone
  below small-speaker reproduction, plus a dead Music bus.

## High Severity
- [x] (resolved) Wrong symptom / wrong fix target — re-centered on audibility +
  bus routing + theme; death-mute retained as a latent fix.
- [x] (mitigated) Feasibility: OfflineAudioContext verification of a
  live-closure synth needs the synth parameterized over its context, or an
  analyser tap on the live graph. The plan names both paths and a decision point
  (Step 1); both satisfy the pass criteria, so this is a build-time choice, not
  an open blocker.

## Medium Severity
- [x] (resolved) Direction doc and code would disagree if gains were lifted
  silently — user chose to revise `audio_direction.txt` targets in the same change.
- [x] (resolved) Dead Music toggle — bed routed to the Music bus; theme added.
- [x] (mitigated) Scope creep: bugfix became a re-voice + theme + verification
  refactor. Phased P1 (audibility + fixes) / P2 (theme) with a commit boundary.

## Low Severity
- [ ] `Audio.ui()` noise click reads as "static" — re-voice to a softer tick.
- [ ] `tickTimer` declared (line 811) but never used.
- [ ] `Audio.creature()` computes pan, never applies it (no StereoPanner).

## Unresolved
- None.

## Well-Defended
- [x] Bed inaudibility is evidence-backed, not opinion: 38 Hz < small-speaker
  floor; fire/wind ~30 dB down; only broadband 3 kHz click reaches the ear.
- [x] No existing audio check exists (runtime + review artifacts have zero audio
  coverage), so the fix adds signal-level verification where none was.
- [x] Register coupling acknowledged: direction doc moves with the code.

## Recommended Next Step
- Adopt the phased plan in `docs/plans/2026-10-10-torre-audio-fix-plan.md`,
  resolve Step 1's verification mechanism, then run `plan-review` on the revised
  plan before implementation.
