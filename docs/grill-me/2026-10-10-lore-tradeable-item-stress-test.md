# Stress-Test Report: Lore as a tradeable item in Torre Nosferatu

- Verdict: READY_WITH_RISKS
- Score: 82/100
- Questions asked: 4
- Dimensions covered: 6/6
- Chosen approach: Modified path (staged minimal)

## Target

Defining the "lore" collectible/tradeable item in `TORRE_NOSFERATU.md` before drafting a
lore section. The brief names lore only as a reward (`:53`) and a room yield (`:75`) with no
item definition, value rule, holder, or machine home.

## Blast Radius

- Artifacts: `TORRE_NOSFERATU.md` (§5 Resources / §6.3 Social / §15 staging),
  `world_template.json` (`required_things` / archetype `things`), `gdd.md` (pricing).
- Systems: exploration reward loop, social Trade/Bargain actions, Phase 2 template check.
- No services, teams, or customers — single-file game jam entry.

## Settled Decisions

1. **Premise — staged, not uniformly tradeable.** Wave 1: flavor/score collectible
   (readable, theme payoff, no exchange). Wave 2: becomes a social currency once NPCs exist
   to price it. Resolves the dangling-currency risk against §15 staging (`:221–223`).
2. **Feasibility — authored as a readable `thing`.** Uses the existing `create_thing`
   pipeline (`readable`/`read_text`) and the `required_things` reachability check. Avoids a
   new top-level section and does not grow the `lore` array flagged as dead data (M3).
3. **Assumptions — auto-pickup on room entry, free journal.** The only cost of lore is the
   exploration already paid; reading never charges a second wax. Keeps the candle-clock hook
   intact without double-charging flavor.
4. **Edge case — lore never trades for wax or matches.** It buys disposition, information,
   safe passage, or lore-for-lore only. Closes the infinite-wax faucet that would otherwise
   defeat the clock and the wax-out loss condition.
5. **Scope — minimal.** A tight §5.1 for the wave-1 item plus one wave-2 contract line. No
   pricing numbers; those defer to the GDD.

## Resulting Item Definition (to draft)

- **Item:** a discrete lore fragment (torn page, inscription, scratched warning).
- **Discovery:** auto-collected on entering a room whose archetype carries it.
- **Reading:** free, out-of-turn journal panel; never an action, never burns wax.
- **Wave-1 value:** score + theme ("Anything Goes" — contradictory scraps per floor).
- **Wave-2 value:** trades for disposition / info / safe passage / other lore — **never**
  wax or matches.
- **Machine home:** a `thing` with `kind: "lore"`, `readable: true`, `read_text`.

## High Severity

- [x] Resolved — infinite-wax faucet (free lore → tradable for wax) would defeat the clock.
  Closed by decision 4.

## Medium Severity

- [ ] **Falsifiability metric missing.** The user did not answer what would make the staged
  choice wrong. Need a measurable: e.g. "floor-1 playtesters collect zero fragments" or,
  post-social, "a fragment changes hands < N times per run." Until then the decision is
  unfalsified.
- [ ] **Object-vs-knowledge on trade.** If a fragment is traded, is the *object* consumed
  (still readable in journal?) or is *knowledge* duplicated (infinite resale, collapses
  value)? Must be pinned in the wave-2 contract.
- [ ] **Duplicate fragments across floors.** Two identical fragments collected — allowed,
  deduped, or scored once? Affects score and trade value.

## Low Severity

- [ ] Auto-pickup on entry vs other on-entry gains (wax/matches loot, `:53`) — confirm no
  ordering/overwrite conflict.

## Unresolved

- [x] **Resolved (grill round 2 + research).** Falsifiability metric — replaced percentages with
  pre-registered binary behavioral triggers (hand-counted, no telemetry), since n≈5 cannot support
  a percentage. See `2026-10-10-lore-tradeable-open-items-research.md` §B.
- [x] **Resolved.** Object-vs-knowledge trade semantics — final model is a **reusable social key**:
  knowledge is non-rival, never consumed; the per-NPC disposition cap (±2) is the sink, so no
  `shared_with` ledger is needed. See `…open-items-research.md` §A.
- [x] **Resolved.** Duplicate fragments — unique per archetype/floor; journal records presence, not counts.

All medium findings closed. Implemented in `TORRE_NOSFERATU.md` §5.1 (§5 table row, §6.3 note,
§14 contract line, §15 staging line).

## Well-Defended

- [x] Staging lore as flavor-first (premise challenge).
- [x] Machine home as a readable thing (avoids M3 dead-data growth).
- [x] Reading does not burn wax (keeps the hook consistent without a hidden exemption).
- [x] Anti-exploit: lore cannot mint light.

## Risk Note (write-time requirement)

`read_text` puts authored prose into `<script>window.TEMPLATE=…</script>`. The 2026-10-10
integration stress-test (M6) already flags `</script>`, `<!--`, and U+2028 as breakers of the
single file, and rendered `read_text` as an injection surface. The lore section must state
that lore text is **data rendered as text, never `innerHTML`**.

## Recommended Next Step

Draft the §5.1 lore block into `TORRE_NOSFERATU.md` using the definition above, plus one
wave-2 contract line. Then run `plan-review` on the brief edit before executing.

## Verdict

```
grill-me READY. lore as a tradeable item in Torre Nosferatu — 90/100, 0 unresolved high (round 2 closed both mediums)
```
