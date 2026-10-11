# scripts/autoplay — Torre Nosferatu autoplay harness

A **minimal, zero-dependency** headless harness that plays the shipped `index.html`
deterministically across many seeds and reports wax-economy data. It drives the game
through its public hooks (`worldState`, `systemState`, `testState`, `move`) plus DOM
clicks on the encounter/social modals — **no gameplay logic is reimplemented**, so the
numbers reflect the real build.

## Why

The five playtest complaints split three ways: #1 (unclear door rules) and #3 ("forcing
doors") are comprehension problems only a human can observe; #2 (multiple keys) and #4
(Run/Endure dominance) are statically provable; only **#5 (wax)** is empirical. This
harness exists to answer #5 and to compare radius-curve variants.

## Usage

```bash
node scripts/autoplay/playtest.mjs \
  --game gameotron_output/20261010_095651/index.html \
  --seeds 50 --arms A,B --policies optimal,greedy \
  --out gameotron_output/20261010_095651/playtest_ab
```

Writes `<out>.json` (raw per-run metrics) and `<out>_summary.txt` (table + success bar).

### Options

| Flag | Meaning | Default |
|---|---|---|
| `--game` | path to `index.html` (required) | — |
| `--seeds` | number of seeds from `--base-seed` | 50 |
| `--base-seed` | first seed | 20261010 |
| `--policies` | `optimal,greedy` | `optimal,greedy` |
| `--arms` | `A` (flattened template radius) / `B` (original collapsing curve) | `A` |
| `--enc` | encounter policy `adaptive` (Endure when wax≤8 & a match) or `run` | `adaptive` |
| `--wax-start` `--wax-max` `--refill` | live-tune the wax pool | template |
| `--out` | output prefix | `<gamedir>/playtest_<ts>` |

### Success bar (greedy, arm A)

- completion ≥ **80 %**, median wax surplus ≥ **15 %**, ghost keys = **0**.

## Policies

- **optimal** — BFS over the full active-floor graph (`worldState` exposes all rooms).
  An upper bound; it understates felt pressure.
- **greedy** — frontier-greedy, **no map memory**: only rooms visited or adjacent to a
  visited room are known; explores to the nearest known room bordering the unknown.
  This is the human-like floor used to judge the bar. A pure random walk is a strawman
  and is deliberately **not** offered.

Both grab refills when wax ≤ 14, choose Run vs Endure adaptively, and relight snuffs.

## Arms

`window.TUNING.radiusPenalty` / `penaltyFloor` are runtime-tunable, so the two radius
curves are measured without a code fork:
- **A** — template default (flattened): penalty `[[18,0],[6,1],[1,2]]`, floor 2.
- **B** — original: `[[24,0],[18,1],[12,2],[6,3],[1,4]]`, floor 1.

## Preflight / portability

Requires `playwright-cli` reachable via `npx --no-install playwright-cli` and a Firefox
browser (`npx playwright-cli install firefox`). The driver **fails loudly** otherwise.
It serves the game from a **separate** Node process — the driver's own event loop is
blocked by `execFileSync`, so an in-process server cannot answer the browser.

## Results (2026-10-11, 50 seeds, test_seed 20261010…20261059)

| arm | policy | complete | median surplus | lowVisTurns | ghostKeys |
|---|---|---|---|---|---|
| A | optimal | 100 % | 56.3 % | 0.0 | 0 |
| A | greedy | **94 %** | **43.8 %** | 0.0 | 0 |
| B | optimal | 100 % | 56.3 % | 27.5 | 0 |
| B | greedy | 94 % | 43.8 % | 28.0 | 0 |

Arm A vs B outcomes are identical: the bot navigates by room graph, so the rendered
radius never gates it. The arm difference is **legibility only** — Arm B leaves the
player at radius 1 for ~43 % of turns while the flame is lit, which is the near-blind
condition suspected in playtest. This is evidence the visibility fix removes a real
condition, not proof it changes completion. The wax finding (raising the cap so refills
bank lifted greedy 74 %→94 %) is in `playtest_ab_summary.txt` and GDD §4.2.
