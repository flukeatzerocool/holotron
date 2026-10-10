# Research Addendum: Lore open items (Torre Nosferatu)

Resolves the two medium findings in
`2026-10-10-lore-tradeable-item-stress-test.md`.

- Item A: object-vs-knowledge trade semantics
- Item B: falsifiability metric for the staged premise

## Method

Infobroker pipeline (Research & Write). Sources: game-economy sources/sinks design
writing, information/rumor mechanic references, one-use-item patterns, player-engagement
metric chapters, and item-duplication exploit postmortems.

## Findings

1. **Every currency needs a sink; value collapses without one.** Economy design
   consistently frames value as sources minus sinks; a good that can be acquired but never
   spent (or spent unboundedly) inflates and stops meaning anything.
   (dev.to economy guide; gamegrowthadvisor economy balancing.)
2. **Information is naturally non-rival — sharing does not destroy the holder's copy.**
   The dominant RPG design answer to "knowledge as currency" is to make the *reward* or the
   *physical carrier* consumable, not the knowledge itself: "a physical manifestation of
   knowledge like a book is useful for one person but then the information is consumed."
   (r/RPGdesign, Knowledge as a Currency.)
3. **One-use items are the concrete pattern, with a known failure mode.** A one-use item
   solves a single purpose; over-reliance makes games "inflexible, tedious or unfair" —
   dead keys after the door is opened. (IFWiki, One-use item.)
4. **Duplication is the classic economy killer; unique-ID + consumption is the standard
   defense.** Diablo 4 shut trading over a dupe exploit; Roblox/MMO guidance is one unique
   id per item, consumed on trade. (designthegame exploits; Diablo/Roblox threads.)
5. **Rumor/information systems hinge on a propagation and tracking decision.** "Untracked
   rumors evaporate from memory; over-tracked ones become just markers." Information
   mechanics need an explicit reliability/propagation rule and a bounded record.
   (Game Mechanics Hoard, Rumor systems.)
6. **Engagement metrics exist but assume telemetry.** Game analytics defines usage metrics,
   funnels, and completion rates as scoping benchmarks — but these presume server telemetry.
   A single-file jam game has none. (ch2-game-metrics.pdf; ScienceDirect completion-rate
   scoping; cyberly collectibles.)
7. **Collectibles raise completion percentage by rewarding exploration and attention.**
   (cyberly collectibles.)

## Recommendation A — Object-vs-knowledge semantics

> **Adopted (simplified).** Grill round 2 found the `shared_with` ledger below redundant: the
> per-NPC disposition cap (±2) is already the sink, so the final model is a **reusable social
> key** — knowledge non-rival, never consumed, no per-pair state. The text below is the research
> baseline; the adopted model drops the ledger.

**Split the two things and make the *reward*, not the knowledge, the consumable.**

- The **journal entry is permanent and non-rival.** Once read, it is your record; it is
  never consumed, and it carries the score/theme payoff regardless of trading.
- The **trade is a one-time offer, bounded per NPC.** Each fragment can be offered to a
  given NPC exactly once (mark `shared_with`); the *same knowledge* may be offered to a
  *different* NPC, because knowledge is non-rival.
- **The sink is the one-time, non-fungible reward** (disposition / info / safe passage).
  Since the reward is not wax or matches, there is no inflation loop and no dupe value.

Why not the alternatives:
- **Consume the fragment on trade** (IFWiki one-use model) → punishes the collectible theme,
  creates dead items, and contradicts "free journal" (you'd re-read what you no longer hold).
- **Duplicate knowledge freely for fungible reward** → collapses value and re-opens the
  wax faucet already closed.

**Duplicates:** treat fragments as unique per archetype/floor and **dedupe on collection** —
the journal holds presence, not counts. If the same id is placed twice, the second pickup
grants score once and is otherwise inert.

## Recommendation B — Falsifiability metric

Because there is **no telemetry** in a single `index.html`, the metric must be a
**pre-registered, hand-counted playtest observation**, not a dashboard. Write the threshold
into the brief *before* the session so the result is falsifiable, not rationalized after.

Wave 1 — is flavor worth collecting?
- **Metric:** fragment engagement rate among testers who collected ≥1 fragment.
- **Threshold:** if **< 50%** voluntarily reopen the journal (or divert to a treasure room
  they can see), flavor-first fails → cut lore or make it mechanical.
- **Anti-signal:** any tester who *avoids* lore rooms is treating the item as a net cost —
  record it; two or more = kill or fix.

Wave 2 — is "tradeable" real?
- **Metric:** lore-for-X trades per run, and distinct NPCs paid.
- **Threshold:** if in a majority of runs where the player holds ≥2 fragments and meets ≥1
  NPC, **zero lore trades** occur, "tradeable" is fiction → demote to flavor or cut.
- **Trap check:** compare wax-out rate of collectors vs avoiders. If collectors wax-out
  materially more often, collecting is a punishment loop (confirms the original concern).

Suggested hand-count checklist column: `opened journal again? Y/N` · `made a lore trade? Y/N`
· `waxed out? Y/N`.

## Caveats

- The principles above are well-established; the *thresholds* (50%, "majority of runs") are
  my calibration for jam scale, not cited figures — no source gives collectible-engagement
  thresholds for a ≤10-minute jam game.
- Reddit thread (r/RPGdesign) was read via search snippet only; the page blocks automated
  fetch. Its consensus (manifestation consumed, not knowledge) is consistent with IFWiki.

## Sources

- https://dev.to/hiroshi_takamura_c851fe71/how-to-design-a-game-economy-sources-sinks-loops-and-balance-j05
- https://gamegrowthadvisor.com/blog/2026-07-14-game-economy-design-virtual-currency-balancing/
- https://www.reddit.com/r/RPGdesign/comments/15tx5ro/knowledge_as_a_currency_how_would_you/
- https://www.ifwiki.org/One-use_item
- https://www.designthegame.com/learning/tutorial/countering-cheating-exploits-game-development
- https://www.diabloz.net/2024/08/blizzard-shuts-down-diablo-4-trading.html
- https://devforum.roblox.com/t/uniquely-identifying-objects-mitigating-duplication-glitches/1337329
- https://gamemechanicshoard.com/mechanic/rumor-systems/
- https://cmps-people.ok.ubc.ca/bowenhui/game/readings/ch2-game-metrics.pdf
- https://www.sciencedirect.com/science/article/pii/S1875952118300181
- https://www.cyberly.org/en/how-do-collectibles-influence-completion-percentages-in-video-games/index.html
