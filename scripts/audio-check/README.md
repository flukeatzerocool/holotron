# scripts/audio-check — control fixtures for the Phase 2b audio check

Dependency-free fixtures used by `puppeteer_agent` (§Holotron Phase 2b) to prove the audio
check is **not vacuously green**. Each is a self-contained HTML page exposing the mandated
hooks (`window.audioTest` + `window.AUDIO_SPEC`).

| Fixture | Bed | Expected verdict |
|---|---|---|
| `dead-bed.html` | 38 Hz-only sine (sub-only) | **MISS** — `rms < 0.02`, `bandRms < 0.003` |
| `good-bed.html` | 200/300/400 Hz sines | **PASS** — clears the fixed default floor |

Default floor (used when a game declares no threshold): bed `rms ≥ 0.02` **and**
`bandRms(>300 Hz) ≥ 0.003`; cue `rms ≥ 0.01`.

## Run

Serve the directory and drive each page with `playwright-cli` (Firefox headless) — same
tooling as the Phase 2 world-model check; the repo forbids npm/node deps.

```
python3 -m http.server 8765 --directory scripts/audio-check
```

Then, per page, in the browser session:

```js
const spec = window.AUDIO_SPEC;
for (const s of spec.scenarios) {
  const m = await window.audioTest(s.id, 1);
  const thr = (s.kind === 'bed') ? spec.thresholds.bed : spec.thresholds.cue;
  console.log(s.id, m, 'rms>=', thr.rms, m.rms >= thr.rms,
              s.kind === 'bed' ? ('bandRms>=' + thr.bandRms + ' ' + (m.bandRms >= thr.bandRms)) : '');
}
```

Expect `dead-bed.html` to report `false` on the floor comparison and `good-bed.html` to
report `true`. A check that passes **both** is broken.

If offline rendering is unavailable (`audioTest` returns `null`), the check falls back to a
live `AnalyserNode` gain probe on `master` and records the path used.
