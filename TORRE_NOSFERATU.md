# TORRE NOSFERATU — Creative Direction Brief

> **What this is.** Human creative *direction* for the Gameotron Game Jam submission
> "Torre Nosferatu." It steers GAMEOTRON by being paraphrased into prompts for
> `ideation_agent`, `gdd_agent`, `world_agent`, `visual_agent`, and `audio_agent`.
> It is **not** a Game Design Document and **not** an implementation spec. The GDD,
> the world artifacts, and `index.html` remain **agent outputs** — that is what keeps
> this a valid "generated through GAMEOTRON" entry.
>
> **Hard boundary.** No hand-written game code. No bypassing the mandatory ideation
> approval gate. Jam compliance lives in `COMPLIANCE.md` (linked, not duplicated).

Run with:

```
Use gameotron with theme: Torre Nosferatu — escape a pitch-black candle-lit tower before Count Orlok takes your light
```

---

## 1. Logline

You wake in the pitch-black Torre Nosferatu with only a candle. The flame reaches a
few feet; beyond it is total dark. Find wax, matches, and the key to the exit — but
every step burns your light, and when the candle dies, **Count Orlok finds you.**

## 2. Tone

**Gothic horror.** Dread over gore. Candlelight and deep reds against absolute black.
Percussive organ, distant howls, dripping stone. Slow-building tension from the
knowledge that the dark is patient and your light is finite.

**Theme interpretation ("Anything Goes"):** the tower is a lawless jumble — rooms,
floors, and encounters that don't obey a single genre or logic; "anything goes"
inside the dark.

## 3. The hook (defining mechanic)

**The candle is your clock, your health, and your map.** Every action costs wax.
When wax reaches zero, the flame gutters — darkness closes in, Orlok's footsteps
converge — and you have a final, desperate scramble before the **guttering dark**
takes you. Light is everything.

## 4. Core loop

Turn-based, grid-based, touch-first.

1. **Move / act** — tap an adjacent tile or choose an action. **One turn = one wax burn.**
2. **Reveal** — the candle lights a fixed radius. Everything outside it is black.
   You explore to *find* things; exploring costs light; not exploring finds nothing.
3. **Encounter** — entering a room may trigger a scene: **exploration**, **combat**,
   or **social**.
4. **Resolve** — spend or gain wax/matches, gain lore/loot, change NPC disposition.
5. **Survive** — keep the candle lit, gather the key, reach the exit.

## 5. Resources

| Resource | Role |
|---|---|
| **Wax** | The candle's fuel. Burns per turn and per costly action. Hitting zero → guttering dark. |
| **Matches** | Re-light a snuffed candle. A snuff is recoverable; running out of wax is not. |
| **Key** | Opens the dungeon exit — the win condition. |
| **Candle radius** | Current reach (a function of remaining wax / candles found). Upgradeable. |
| **Dread** | A single tower-wide heat dial, 0 (Calm) → 8 (Hunted): how much the dark and the survivors have marked your cruelty. Cold acts raise it, warm acts lower it. It reads as weather and tightens Orlok's search — it does not track individual deeds. |

**Dread** is the social counterweight to wax. Cold acts — theft, threats, exploitation —
buy light and tempo but raise dread; warm acts — sharing light, honoring a bargain,
allying — bring it back down. Dread sits as shared weather over the whole tower: at
higher tiers, strangers are warier and Orlok closes faster (§9). It never hard-locks the
player. (Concrete numbers live in the GDD.)

## 6. Scene types

### 6.1 Exploration (the moment-to-moment)
Navigate the dark, discovering rooms for wax, matches, the key, and lore. The central
tension: **exploration is necessary but costs the very resource you're spending to do it.**

### 6.2 Combat (avoidance, not fighting)
No traditional battle system. When a creature appears, choose:
- **Run** — escape, but **spills wax** (loss of light).
- **Endure / be spooked** — **spills wax AND snuffs the candle** (needs a match).

Creatures are hazards and decisions, never HP-sponges.

### 6.3 Social (the other survivors)
**Four NPCs** are also trapped and hunting for the exit — rivals, assets, or dangers.

Social play runs on **two tracks**:

- **Disposition** — per NPC, from **Hostile (−2)** to **Allied (+2)**.
- **Dread** — one tower-wide 0–8 heat dial (see §5). It reads as weather: it marks how
  much the tower has turned against you, tightens Orlok's search, and makes strangers
  warier — it is not a per-deed ledger.

**Two poles.** Every action sits between **warm** (aid) and **cold** (exploit):

- **Warm — buys allies, spends light.** Costs wax and turns now; returns shared light
  (a companion lantern that widens the radius or splits the drain). Compounds only if
  the alliance survives.
- **Cold — buys light, spends allies.** Instant wax, matches, loot, and tempo; raises
  dread, which accelerates Orlok.

Core actions, warm → cold:

| Action | Disposition | Light / wax | Dread |
|---|---|---|---|
| **Share light** | +2 | − (give wax now) | −1 |
| **Ally** | → +2 (locked) | sustained shared radius | −1 |
| **Bargain** | ±1 | ± exchange | 0 |
| **Trade** | 0 | ± even swap | 0 |
| **Steal** | −2 | ++ (wax / matches / lantern) | +1 |
| **Threaten** | −2 | + (extracted) | +1 |

The balance: **warmth buys light later; cruelty buys light now.** A cold run is richer
in light immediately but reaches wax-out sooner, because dread makes Orlok close faster.
Exact numbers live in the GDD.

### 6.4 Puzzles / traps / simple platforming
Thematic obstacles kept deliberately simple to preserve the game's calm, decision-driven
pace: a locked door needing a lever, a collapsing floor, a light-sensitive trap.

## 7. Creatures (classic, escalating)

- **Bats** — swarm, startle, minor wax spill.
- **Rats** — swarm near food/light, gnaw matches.
- **Wolves** — stalk corridors; forcing a run.
- **Spiders** — webs cost turns (and thus wax) to clear.
- **Shades** — drain light directly.
- **Light-eater** — a shadow that snuffs the candle on contact.
- **Count Orlok** — the reaper. Not fought. He arrives when the light fails.

## 8. Loss / win / fail-forward

- **Win:** hold the **key**, reach the **exit**, and escape the tower.
- **Fail-forward (guttering dark):** at zero wax the flame gutters for a few turns —
  radius shrinks, Orlok closes in — and you may still reach a match or the exit. Only
  when that final grace is spent does Orlok take you. **Orlok is triggered only by
  wax-out; Dread sets how fast he closes during the guttering dark.**
- **Game Over:** "Count Orlok takes you." Retry / back to title.

## 9. Progression & difficulty (jam requirements)

- **Beginner-friendly entry, linear curve.** Floor 1 is generous: an early room with
  extra wax/matches; the first light-tending success lands well **inside 30 seconds**.
- **First success < 30s:** the opening beat teaches "find wax, keep the flame" and
  delivers an immediately readable win (a saved candle / first wax found).
- **Near-Miss Bonus:** reward grazing a creature or escaping with near-zero wax.
- **Zone Bonus:** reward first entry to each new floor/region.
- Escalate **one** variable per floor (creature density, wax drain, dark rooms, NPC
  pressure, trap frequency) — never two new systems at once.

**Dread tiers (the social escalation dial).** Dread is the one pressure that escalates
with *play* rather than floor. It reads as weather over the tower:

| Dread | State | Effect |
|---|---|---|
| 0–1 | Calm | NPCs start Neutral; Orlok at baseline. |
| 2–3 | Watched | New NPCs start Wary; the dark presses closer. |
| 4–5 | Marked | Warm acts cost an extra turn; Orlok's search advances. |
| 6–7 | Hunted | No new Ally without atonement first; Orlok's reach widens. |
| 8 | Hunted (full) | Every NPC reads Hostile until you atone; Orlok locks on. |

Social play and Dread **arrive on floor 2–3, never floor 1** — floor 1 stays wax and
exploration only, so the beginner rule and the <30s first success hold. A cold-built run
can always claw back through warm gestures, so Dread never hard-locks the player.

## 10. Screens (≥6, per `COMPLIANCE.md`)

Title · How to Play · Gameplay · Pause (music/SFX toggles, How to Play, quit) ·
Settings (music/SFX, reset, credits) · Game Over ("Count Orlok takes you") ·
Victory (escape). Plus in-scene overlays for combat and social encounters.

## 11. Visual direction notes (feeds `visual_agent`)

- Palette: absolute black, candle amber/gold radius, cold grey stone, arterial red accents.
- The world exists only where the light reaches — **radial light mask over darkness** is
  the signature look; reveal is gameplay.
- Candle flame should feel alive: flicker, guttering, shrink as wax drops.
- Gothic architecture: arches, iron sconces, caged stairwells, ancestral portraits
  whose eyes follow. Readability at 375 px is a hard constraint.

## 12. Audio direction notes (feeds `audio_agent`)

- A pervasive low drone; a ticking/consuming fire sound as wax burns (the clock you hear).
- Creature cues: bat squeaks, rat scurry, wolf howl, shade whisper — directional.
- Wax-out: the drone swells, a heartbeat enters, Orlok's theme resolves.
- Music/SFX toggles required in Pause and Settings.

## 13. Input (both mandatory)

- **Touch:** tap adjacent tile to move; tap UI for actions; swipe optional for panels.
- **Mouse:** click to move/act; hover highlights reachable tiles.
- **Optional keyboard:** WASD/arrows/Space only if "full controls" is requested.
- Finger-sized targets (≥48 px); viewport-aware; responsive canvas.

## 14. World-model contract (settled)

Procgen lives **in the game**; `world_agent` authors and `manage_world(convert)` validates a
static **tower template** (room archetypes — exploration / combat / social / puzzle /
treasure / exit — the connectivity rules between them, and the thing/encounter roster: wax,
matches, key, creatures, NPCs). It emits `world_template.json` + `world_template.txt`.

- `code_agent` embeds the template as `window.TEMPLATE`, generates floors from it seeded by
  `window.SEED` (default random, overridable), and exposes `window.worldState()` (the
  generated rooms — each tagged with its archetype id — exits, and things) + `window.move(dir)`.
- The game exposes a **deterministic seeded mode** for testing (a fixed seed ⇒ a known layout).
- The Phase 2 behavioral check validates a **fixed seed's** generated layout against the
  template's constraints: dangling exits, reachability, required things, required encounters,
  and (since C6) each room's archetype role + per-archetype `count` bounds on the active
  floor — rather than a 1:1 fixed map. **Connectivity rules are not yet validated** (filed as
  C7). Rule Breaker's 1:1 graph check remains the sensitivity control.
- Holonovel's `manage_world(action: generate)` is **not** used: it is ruleset-table-driven
  and content-absent ruleset-free (REQ-431).

## 15. Must-haves / must-nots

**Must:**
- Single `index.html`, vanilla JS, embedded HTML/CSS/JS (per `COMPLIANCE.md`).
- Candle-as-clock; wax/matches/key; grace on wax-out; four NPCs; ~6 social actions; a single 0–8 Dread dial; avoidance combat.
- Touch + mouse; responsive; ≥6 screens; music/SFX toggles.
- **Staged delivery:** ship the floor-1 core first (candle, wax/matches, key, exit, seeded
  floors, one creature type) as wave 1; social + Dread land as wave 2 (floor 2–3). This keeps
  the mandatory game shippable even if wave 2 is cut at T-6h.

**Must not:**
- No traditional fight-the-monster battle system.
- No hand-authored `index.html`; no bypassing the approval gate.
- No hard death that contradicts the beginner-friendly first-success rule.
