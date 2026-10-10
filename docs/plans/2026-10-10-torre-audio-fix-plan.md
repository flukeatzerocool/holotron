# Plan — Torre Nosferatu audio fix (revised)

Status: revised per `docs/grill-me/2026-10-10-torre-audio-stress-test.md`
(report verdict READY_WITH_RISKS, 78/100). Re-run `plan-review` before building.

## Symptom (confirmed with user)

- Heard nothing for the whole playthrough; the only audible element was a harsh
  broadband click ("static") on menu clicks.
- **Not** the death-mute bug — that is latent (only fires at game-over).

## Root cause

1. `audio_direction.txt` targets the ambient bed at "edge-of-hearing ~-34 dB,
   never louder than -20 dB" and it was implemented faithfully → below audibility.
2. Drone is a 38 Hz sine only (index.html:826–829) → below small-speaker
   reproduction (rolled off < ~150–200 Hz).
3. `musicGain` (index.html:823) has no source; all ambience routes to `sfxGain`
   (831/839/843) → Music toggle dead.
4. `Audio.death()` ramps master to `0.0001` (893) with no reset → latent silence
   after death.
5. `Audio.ui()` = `noiseHit(3000,…,0.02)` (914) — the only element loud enough to
   hear, and it is broadband → perceived as static.

## Files

| ID | File | Role |
|---|---|---|
| F1 | `gameotron_output/20261010_095651/index.html` | source of truth (tracked) |
| F2 | `build/index.html` | gitignored deploy copy — re-staged |
| F3 | `gameotron_output/20261010_095651/audio_direction.txt` | revise mixer targets |
| F4 | `gameotron_output/20261010_095651/buglist_105719.txt` | append `FIXED BUGS:` |
| F5 | `CHANGELOG.md` | date-stamped bullet, on commit |

Rollback cost: **1** (`git checkout` F1, F3, F5; F2 regenerated).

## Phase P1 — Make it audible + fix latent bugs

**Step 1 — Parameterize the synth over its context (enables offline verification). M**
- Extract the synthesis primitives (`build`, `tone`, `noiseHit`, envelope) so they
  take the target `AudioContext` and destination node; the live path calls the
  same primitives with the live ctx (behavior-preserving).
- **Seed the RNG for the synth.** `noiseBuf()` (818) and every `Math.random()`
  jitter (e.g. 884, 898) must draw from an injectable RNG: live path keeps
  `Math.random`; the offline/verification path injects a seeded PRNG so renders
  are byte-deterministic. This is required for the determinism criterion.
- Add `Audio.offline(scenario)` → constructs an `OfflineAudioContext`
  (`window.OfflineAudioContext || window.webkitOfflineAudioContext`; if neither
  exists, the harness falls back to the `AnalyserNode` tap), schedules that
  scenario's cues, renders, returns `{ rms, peak, bandRms(>300Hz) }`.
- Decision point: if parameterization proves too invasive, use the `AnalyserNode`
  tap on `master` (live graph) with `getFloatTimeDomainData` RMS — same pass
  criteria, less refactor. Resolve before Step 7.

**Step 2 — Re-voice + re-level the bed (audible on small speakers). M**
- Drone: keep the 38 Hz sub, add 76/114/152 Hz partials and a soft 180–260 Hz
  component; open the lowpass 120 Hz → ~450 Hz; lift `droneGain` 0.022 → ~0.09–0.12.
- Fire: 0.012 → ~0.05; wind: 0.010 → ~0.045.
- Centralize every level in a `MIX` constants object (removes the magic numbers at
  index.html:829/838/842 and the cue peaks).
- **MIX call-site sweep (blocker):** every hardcoded bed level must consume `MIX`,
  or it silently overrides the new values (reproducing the bug): `snuff` 0.0001
  (889), `matchStrike` restore 0.022/0.012 (890), `guttering` ramp 0.10 (891),
  `dreadShift` `0.022+0.012*tier` (895). Grep for `0.022`, `0.012`, `0.010`,
  `0.0001` in the module and replace all bed references.

**Step 3 — Route the continuous bed to the Music bus. S**
- `droneGain`/`fireGain`/`windGain` → `musicGain` (831/839/843). Discrete cues
  stay on `sfxGain`.

**Step 4 — Fix master-mute-after-death (latent). S**
- Add exported `Audio.resetMix()`: `cancelScheduledValues` + `setValueAtTime(0.9)`
  on `master`, reapply `state.music/sfx`, restore bed base levels; no-op when ctx
  is null. Call at top of `startGame()` (1980).

**Step 5 — Apply creature panning (StereoPanner, fallback direct). S/M**
- Extend `tone`/`noiseHit` with optional `pan` (guarded by
  `typeof ctx.createStereoPanner === 'function'`); pass the computed `p` from
  `creature()` (896).

**Step 6 — Soften `Audio.ui()` (the "static"). S**
- Replace the 3 kHz noise click with a short, quiet tonal tick.

## Phase P2 — Give Music content

**Step 7 — Dread-tier bed layer. M**
- A low melodic layer on `musicGain` whose level (and lowpass) rises with
  `dreadTierIndex`; wire `Audio.dreadShift` at tier change (track `G._dreadTier`
  in `renderHUD`, index.html:972; init in `makeState`, 716).

**Step 8 — Orlok's theme cell. M**
- Organ sine + detuned saw + one heartbeat kick, on `musicGain`; fired on entering
  guttering dark. Per `audio_direction.txt`.

## Verification (deterministic, headless — no audio hardware)

OfflineAudioContext (or analyser tap per Step 1), seeded RNG, per-scenario RMS:
1. Render scenarios: turn-1 bed, move/tick, creature cue, wax-found,
   guttering(+theme), victory. Each scenario uses a fixed seed.
2. Concrete thresholds (adjust at build time after a baseline render, but these
   are the starting bars): bed `rms ≥ 0.02` and `bandRms(>300Hz) ≥ 0.005`;
   cues `rms ≥ 0.01`; silent-expected renders `rms ≤ 0.001`.
3. Mute independence: Music-off → bed `rms ≤ 0.001` while an SFX cue stays
   `≥ 0.01`; SFX-off → cue `≤ 0.001` while bed stays `≥ 0.02`.
4. Determinism: with the seeded RNG (Step 1), render each scenario twice → RMS
   values equal to 4 dp.
5. Regression: 0 console errors; 3-viewport smoke (1920×1080, 800×600, 375×667);
   `node scripts/check_template.mjs --template gameotron_output/20261010_095651/world_template.json --state gameotron_output/20261010_095651/state_20261010.json --fail-on spatial` → exit 0.
   **Confirmation step:** before relying on the existing `state_20261010.json`,
   confirm the audio edits touch neither `worldState()` nor `systemState()` (diff
   shows only the Audio module + call sites), else re-export state first.

## Docs / registers

- F3: revise `audio_direction.txt` mixer targets to the new audible values
  (direction and code must agree).
- F4: append `FIXED BUGS:` summary to `buglist_105719.txt`.
- F5: `CHANGELOG.md` (via `changelog-before-commit`) on commit.
- Re-stage F2; deployment stays on hold until the user confirms.

## Success criteria

1. Bed and cues are audible on small speakers (bandRms > 300 Hz floor).
2. Music off silences the bed; SFX off silences cues; each independent.
3. Master audio restored after death → retry.
4. All per-scenario RMS thresholds pass deterministically; template checker green.

## Unresolved / conditions

- Step 1 verification mechanism (parameterized synth vs. analyser tap) — resolve
  at build time; both satisfy the pass criteria.
- Scope: P1 alone fixes the reported symptom; P2 is additive. Commit boundary at
  the P1/P2 seam so a smaller change can ship first.
- External tool: verification uses `playwright-cli` (confirmed available). If it
  is unavailable at build time, fall back to a manual listen for the audibility
  criterion and keep the deterministic gain-graph probe for routing.
