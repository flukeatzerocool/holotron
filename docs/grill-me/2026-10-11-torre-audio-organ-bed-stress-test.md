# Stress-Test Report: Torre Nosferatu — replace drone bed with organ+choir music

- Verdict: READY_WITH_RISKS
- Score: 73/100
- Questions asked: 9
- Dimensions covered: 6/6
- Chosen approach: Full A+D rewrite — phrase-based original-minor organ bed + formant choir, escalating with Dread, on the Music bus; crackle + cues on SFX

## Blast Radius
- Code / Data: `20261011_004054/index.html` (audio IIFE §7, `MIX`, `AUDIO_SPEC`), single self-contained client-side file. No services, no data stores, no backend, no user data.
- Docs / Registers: `audio_direction.txt` (§0 revision block), `CHANGELOG.md`.
- Deploy: `build/index.html` is the deploy target and is **stale** (107 KB, Oct 10 12:19) vs the canonical source (121 KB). `COMPLIANCE.md:14` still cites `gameotron_output/20261010_095651/index.html`.

## Biggest Pushback
- **The previous fix for this exact complaint already failed.** `docs/grill-me/2026-10-10-torre-audio-stress-test.md` diagnosed "static" as: 38 Hz sub below the small-speaker floor, fire/wind ~30 dB down, only the broadband click reaching the ear. The §0 revision remediated it (harmonics to ~304 Hz, bed raised to ~−18 dB) — and the user still reports static. Evidence therefore supports a *structural* change (the user's instinct is sound), but also proves the subjective acceptance bar has not been met even once, and the diagnosis–fix–verify loop has already iterated once without success.
- **Accepted high risk:** user chose "single pass, listen at end" over a per-layer listen checkpoint, on the submission-critical path with the jam window closing Oct 11 12:00 (`COMPLIANCE.md:3`) and deploy still pending (`ROADMAP.md:29`).
- **Prerequisite defect:** the canonical artifact vs `build/index.html` vs `COMPLIANCE.md` drift must be reconciled before deploy; audio work on the canonical file will not ship if `build/` is not refreshed.

## High Severity
- [ ] Accepted risk (user sovereignty): full rewrite, no fallback checkpoint, on the deadline path. Failure is discovered only at listen-at-end, when no window remains to fall back to the 10-line wedge.
- [ ] Artifact drift: `build/index.html` is stale and `COMPLIANCE.md` cites an older run path. Confirm/refresh the deploy copy from `20261011_004054/index.html` before Butler push.
- [ ] Subjective acceptance unmet: no automated or human test has yet declared a bed "good"; `window.audioTest` proves audibility/pitch presence, not musical quality.

## Medium Severity
- [ ] Choir-hiss regression risk: the formant choir uses detuned saw + breathy noise; mis-tuned, it reintroduces the very "static" being removed. Mitigation: cap the noise component and verify bandRms.
- [ ] Rewire hazard: `snuff`, `matchStrike`, `guttering`, `resetMix`, `setDread` reference `droneGain`/`fireGain`/`windGain` (`index.html:1004-1031`); a missed reference throws mid-game at a terminal beat. Mitigation: grep pass for the three removed globals + live smoke test.
- [ ] Music-off now silences organ **and** Orlok's theme (footsteps survive). Accepted semantic; recorded deliberately.

## Low Severity
- [ ] `Audio.creature()` computes pan but never applies it (no StereoPanner) — carried over from the 2026-10-10 report, still open.
- [ ] `tickTimer` declared but unused (carried over).
- [ ] SECURITY/RISK: N/A — no auth, no network, no data; only failure mode is a JS exception, covered above.

## Unresolved
- [x] Offline `bed` floors vs sparse music → resolved: force the opening organ phrase at t=0 in offline renders only.
- [x] Playback target → resolved: laptop/phone speakers; design mandates >300 Hz energy.
- [x] Melodic content → resolved: original 4-note minor motif (not a Dies Irae quote).
- [x] Density → resolved: phrase-then-silence, one variation per Dread tier.
- [x] Toggle bus → resolved: organ+choir on Music, crackle+cues on SFX.
- [ ] Deploy-copy refresh (High) — ownership/step not yet assigned.

## Well-Defended
- [x] Canonical artifact identified with evidence (newest 121 KB build) — not guessed.
- [x] Symptom re-rooted with prior-report evidence, not opinion.
- [x] Promotion of the existing `orlokInto` organ idiom (reuse) rather than a from-scratch instrument.

## Outside Voice Findings
- Not run (user did not request).

## Recommended Next Step
- Revise the plan to include: (1) a forced t=0 organ phrase in the offline `bed` path, (2) a grep+smoke rewire gate, (3) a `build/` refresh step before deploy. Then re-run `plan-review` on the revised plan before implementing. Because the accepted no-checkpoint risk cannot be reduced without the user re-scoping, proceed only with the deadline tradeoff explicitly acknowledged.
