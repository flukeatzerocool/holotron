# Stress-Test Report: Torre Nosferatu creative-direction brief (v2, after manual edits)

- **Verdict:** READY_WITH_RISKS
- **Score:** 84/100
- **Questions asked:** 5
- **Dimensions covered:** 7/7
- **Chosen approach:** Approach A — single 0–8 Dread dial; ~6 social actions; detail demoted to the GDD

## Blast Radius

- **File:** `TORRE_NOSFERATU.md` — sections §3, §5, §6.3, §7, §8, §9, §12, §15 need edits
- **Coordination:** §14 world-model template contract depends on the parallel Holonovel integration session
- **Downstream:** `gdd_agent` (now owns the concrete social system), `world_agent`, `code_agent`

## Biggest Pushback

The manual edits added a **two-ledger social system + 11-action table + 8-tier
escalation + a formula** (`effective = personal − floor(dread ÷ 2)`). In a 2-day,
single-file, 0-retry-`code_agent` jam, that is a **second game** stapled to the candle
roguelike, and the formula/tier detail is *specification* — it risked `gdd_agent`
transcribing the brief (undercutting the "generated, not hand-built" claim). Cut to a
single heat dial with intent-level detail.

## High Severity

- [x] none open

## Medium Severity

- [ ] **Cold-rush unverified.** Dread's deterrent is *structural* (dread scales Orlok's
      search speed) — accepted by design, but unmeasured. No metric committed.
- [ ] **Template contract external.** §14 depends on the other session confirming
      `world_agent` can author a room-archetype template and the Phase 2 check can
      validate a fixed seed.

## Low Severity

- [ ] **Terminology drift:** "guttering dark" vs "strangling darkness" (§3 line 41);
      "Shades" (§7) vs "wraith whisper" (§12). Unify.
- [ ] **Onboarding unsequenced:** social/Dread must first appear on floor 2–3, never
      floor 1, to protect the <30s beginner rule.
- [ ] **Detail demotion:** strip any lingering numbers/formulas from §5/§6.3/§9.

## Unresolved

- [ ] none blocking

## Well-Defended

- [x] **Candle hook is intact and singular** — the light clock remains the spine.
- [x] **Dread shares the game's currency (light)** — "warmth buys light later; cruelty
      buys light now" is a coherent thesis, kept at Approach A.
- [x] **"Known" / unseen-pickpocket mechanic removed** — no per-action ledger, so the
      untestable detection model is gone.
- [x] **Detail demoted** — resolves the validity/transcription risk; `gdd_agent` owns
      the concrete system.
- [x] **Orlok rule reconciled (proposed):** wax-out triggers Orlok; Dread sets his
      closing speed during the guttering dark.
- [x] **Action list trimmed to ~6** (Share light, Ally, Bargain, Trade, Steal, Threaten).

## Falsifiability

Per the chosen structural deterrent: cold play is punished by the same clock it feeds
— Dread must make a cold run reach wax-out materially sooner. If a cold-rush reaches the
exit with Dread never crossing tier 2–3, the deterrent has no teeth and Dread should be
cut. (No playtest threshold committed; kept as a design assumption.)

## Recommended Next Step

1. Revise `TORRE_NOSFERATU.md` to Approach A + demoted detail + the editorial fixes above.
2. Coordinate the §14 template contract with the Holonovel session.
3. `plan-review` the 5-doc re-scope, then run `use gameotron` (theme override) → gate → pipeline.
