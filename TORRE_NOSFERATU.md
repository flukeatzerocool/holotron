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

You wake at the top of the pitch-black Torre Nosferatu with only a candle. The flame
reaches a few feet; beyond it is total dark. Work your way **down** the tower — floor by
floor, toward the ground-floor door that is your only way out — finding wax, matches, and
the key to the exit. Every step burns your light, and when the candle dies, **Count Orlok
finds you.**

## 2. Tone

**Gothic horror.** Dread over gore. Candlelight and deep reds against absolute black.
Percussive organ, distant howls, dripping stone. Slow-building tension from the
knowledge that the dark is patient and your light is finite.

**Theme interpretation.** The jam theme is open-ended — *anything goes*, so the entry picks
its own. **Torre Nosferatu** turns that permission inward: the tower is a lawless jumble —
rooms, floors, and encounters that obey no single genre or logic; "anything goes" in the
dark.

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
| **Matches** | Re-light a snuffed candle (from a creature or a hazard). Double duty: snuff-recovery and hazard crossing. A snuff is recoverable **only while you hold a match**; with none, you enter the guttering-dark grace (§8). Running out of wax is likewise terminal. |
| **Key** | Opens the dungeon exit — the win condition. |
| **Candle radius** | Current reach (a function of remaining wax / candles found). Upgradeable. |
| **Dread** | A single tower-wide heat dial, 0 (Calm) → 8 (Hunted): how much the dark and the survivors have marked your cruelty. Cold acts raise it, warm acts lower it. It reads as weather and tightens Orlok's search — it does not track individual deeds. |
| **Lore** | Found fragments. Non-survival: it never extends the candle. Wave 1, a readable scrap and score beat; wave 2, the trade good for disposition / information / safe passage — never for light, bounded by the per-NPC disposition cap. |

**Dread** is the social counterweight to wax. Cold acts — theft, threats, exploitation —
buy light and tempo but raise Dread; warm acts — sharing light, honoring a bargain,
allying — bring it back down. Dread sits as shared weather over the whole tower: at
higher tiers, strangers are warier and Orlok closes faster (§9). It never hard-locks the
player. (Concrete numbers live in the GDD.)

### 5.1 Lore (the tradeable fragment)

A lore fragment is a discrete found object — a torn page, an inscription, a scratched warning.
Unlike wax, matches, and the key, it is **not survival**: it never extends the candle. Its value
is knowledge and standing, not light.

- **Discovery & reading.** Fragments are collected automatically on entering a room whose
  archetype carries one, and read in a free, out-of-turn journal. Reading never costs a turn —
  the only cost of lore is the exploration already paid to find it.
- **Wave 1 — flavor & score.** Each fragment is a readable scrap and a collection beat. The
  tower's lawless jumble ("anything goes") makes fragments contradictory pieces of its history,
  one voice per region.
- **Wave 2 — the social key.** The natural commodity for **Bargain** and **Trade**. Knowledge is
  non-rival: offering a fragment never consumes it and never removes its journal entry — the same
  knowledge can be offered to any survivor.
- **What it buys — and doesn't.** Disposition, information (a hint that saves exploration = saved
  wax), or safe passage. **Never wax or matches.** Value is bounded by the per-NPC disposition cap
  and the finite info/passage rewards — the cap is the sink, so no fragment can be farmed for light.
- **Duplicates.** A fragment is unique per archetype/floor; the journal records presence, not counts.
- **Falsifiability (pre-registered, hand-counted — no telemetry).** *Wave 1:* if no tester reopens
  the journal unprompted, or any tester avoids a lore room, the flavor layer fails → cut or
  mechanize it. *Wave 2:* if, in runs where the player holds ≥2 fragments and meets ≥1 NPC, no
  tester makes a lore trade unprompted, "tradeable" is fiction → demote to flavor. *Trap check:*
  compare the wax-out rate of collectors vs. avoiders.

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
**Five NPCs** are also trapped and hunting for the exit — roaming the tower floor to floor,
like you. Each is a distinct personality and a distinct temptation: **Vlask** the hoarder
(cold possession — a wax cache guarded dear), **Sister Marta** the archivist (knowledge —
lore and information, never light), **Ilona** the bitten (the dark's bargain — she "knows
the way", at a price), **Petr** the innocent (warmth's wager — a light worth protecting
that slows you), and **Nadja** the tomb-robber (the rival — winsome, transactional, always
one landing ahead). Their voices, goals, and the exact disposition each carries are
authored downstream (GDD / world template), not fixed here.

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
  Dread, which accelerates Orlok.

Core actions, warm → cold:

| Action | Disposition | Light / wax | Dread |
|---|---|---|---|
| **Share light** | +2 | − (give wax now) | −1 |
| **Ally** | → +2 (locked) | sustained shared radius | −1 |
| **Bargain** | ±1 | ± exchange | 0 |
| **Trade** | 0 | ± even swap | 0 |
| **Steal** | −2 | ++ (wax / matches / lantern) | +1 |
| **Threaten** | −2 | + (extracted) | +1 |

Lore (§5.1) is the commodity most often exchanged in **Bargain** and **Trade**; it never buys
wax or matches.

The balance: **warmth buys light later; cruelty buys light now.** A cold run is richer
in light immediately but reaches wax-out sooner, because Dread makes Orlok close faster.
Exact numbers live in the GDD.

### 6.4 Hazards, puzzles & movement
Three classes, kept deliberately simple to preserve the game's calm, decision-driven pace. All
are **turn-and-light problems, not reflex tests**: a wrong answer costs light, never a life — no
obstacle kills outright; at worst it enters the **guttering-dark grace**, the tower's one
terminal path (§8).

#### 6.4.1 Hazards (the trap system)

A **hazard** is a static danger you choose how to pay for. It is not a creature (no chase) and
not a puzzle (no lock-and-key): it is a tax with two doors, and reading which door is cheaper is
the decision. Hazards begin **below the Spire**: the first floor carries no hazards and no
social play — only wax, exploration, and at most the first teaching creature (bats, §7).

- **Cost grammar.** **Avoid → costs wax**: the safe route exists by construction but is longer,
  so dodging burns turns, and turns are wax. **Spring → snuffs the candle + costs a match** to
  re-light. You take no hit-point damage; you trade tempo against fuel.
- **States.** `armed → sprung`, and the change **persists** (§6.5) — a sprung hazard is a
  permanent edit to the floor, never fresh on return.
- **Telegraph.** Every hazard is **readable before you commit** — an intrinsic cue inside the
  **spill ring** (a hairline crack, a glyph's faint pulse, settling dust), never a hidden gotcha.
  It reads with SFX off.
- **Blind crossing.** Where the cheap door is to **snuff and cross dark** (the light-glyph),
  snuffing pre-scouts a **memory shadow**: the safe crossing tiles stay faintly visible for a few
  turns, so movement stays **tap-adjacent** — no new verb, no tap-into-black.
- **No match, no re-light.** A snuff is recoverable **only if you hold a match**; a snuff with
  **zero matches** enters the same **guttering-dark grace** as wax-out (§8) — the tower's one
  terminal path, never an instant death. This is the only death door a hazard opens.
- **Placement.** A hazard's room is **never required for progress**: every required thing (the
  floor-key and the lore that travels with it) sits in a hazard-free room, so a hazard can never
  strand you from the key, the exit, or a refill — you can always route around it. (The floor graph
  is a spanning tree, so a hazard room is a skippable leaf, not a bridge on the required path; the
  checker asserts "no required thing in a creature/hazard room.") Phase 2 re-confirms reachability
  and this placement invariant on the pinned seed.
- **The survivors trip them too.** NPCs roam and can **spring hazards themselves**, and the
  change **persists** — a survivor may open or close a route under you ("the tower changes").
  This is **flag-gated** (§15); because a hazard room is never required for progress (above), even a
  sprung hazard can only lengthen a route, never sever it.
- **Falsifiability (pre-registered, hand-counted — no telemetry).** If either door ever becomes
  **strictly dominant** — testers always avoid, or always spring — the choice is fake, not the
  system: cut the hazard or retune the two costs so the branch flips with wax/match state.

#### 6.4.2 Puzzles

Routing problems with a lock and a key of their own — **route/solve, never snuff**.

- **Locked door / lever.** A rune or lever elsewhere on the floor opens it; the puzzle is routing
  (reach the lever before the light dies), not dexterity. Reachability is guaranteed, and a
  **lore/information** fragment (§5.1) can hint the lever's quarter — knowledge that saves wax.
- Distinct from the exit **Key**: the lever gates a room; the key gates the tower.

#### 6.4.3 Movement

- **Simple platforming.** A short light-and-dark hop across a gap or up a broken stair: the next
  foothold is only *visible* inside the radius, so the jump is a **scout/commit** reconnaissance
  problem (scout the landing before you commit), never a twitch sequence. Grid-adjacent,
  one-tile moves.

#### 6.4.4 Hazard roster (data-driven)

Five hazards, each an `encounter_roster` entry (`kind:"hazard"`, `threat`/`effect`/`floor`) placed
in a **non-required room** — one that holds no required thing, so a hazard is never on the path to
the key/lore (§14). **One new hazard is introduced per floor**, mirroring the creature rule (§7)
and sharing that floor's single escalation budget (§9).

| Hazard | Trigger | Avoid (wax) | Spring (snuff + match) | Telegraph | First appears |
|---|---|---|---|---|---|
| **Collapsing floor** | step on a compromised tile | the longer safe path | the tile gives way — snuff | hairline crack, settling dust | below Spire / early |
| **Light-sensitive glyph** | enter while lit | route around the ward | snuff and cross on the memory shadow | faint glyph pulse | early–mid |
| **Pressure plate** | weight on the plate | step over the sequence | the plate trips a snuff-ward | worn plate, scuffed stone | mid |
| **Cursed ward** | cross its threshold lit | the warded hall's detour | snuff to pass unseen | cold glow at the doorframe | mid–late |
| **Crumbling stair** | a broken step mid-descent | take the intact flight | the stair fails — snuff | loose grit, cracked tread | late |

*(A "crumbling stair" is a hazard on a fixed tile; it is not the movement hop of §6.4.3. A "cursed
ward" is distinguished from the light-glyph by its telegraph — a cold doorframe glow, not an
in-room pulse.)*

### 6.5 The tower (floors and the descent)

The tower **descends**: you wake at the **Spire** (the top floor) and work **down** to the
**ground floor**, where the front door is the only exit. "Floor 1" for pacing purposes is
the **first floor played** — the Spire — and it is a gentle tutorial: wax, exploration, and at
most a first teaching creature, with no social, Dread, or hazards (§9).

- **Generated, not authored.** Floors are generated at runtime from a static **tower
  template** (room archetypes, the connectivity rules between them, and the thing/encounter
  roster). The template describes *a* floor; the game decides depth.
- **Winding, not a stack.** A floor is a graph — several stairwells, loops, dead ends, and
  the occasional stair that skips a tier ("anything goes" geometry). Routing is a real
  choice: the fast stair, the wax-rich stair, or the stair a survivor is camped on.
- **Persistence.** Each floor is generated once and then lives — items you left, a key a
  survivor dropped, doors you opened all remain. Backtracking returns you to the floor you
  changed, not a fresh one.
- **The survivors move too.** NPCs (§6.3) roam and change floors like you; they are active
  where you are, and "elsewhere" where you are not.
- **Budget.** A run targets ~5–8 minutes (~75–100 turns): wax ~30, ~1 burn per turn, and one
  guaranteed refill room per floor so a floor is ~15–20 productive turns. The Spire's first
  refill is reachable well inside 30 seconds (§9).

## 7. Creatures (classic, escalating)

Creatures are hazards and decisions, never HP-sponges (§6.2). "Escalating" means the
**roster widens with depth**: each floor introduces at most **one** new creature (one
variable per floor, §9), then reuses earlier ones at higher density.

| Creature | Behaviour | Cost to the player | First appears |
|---|---|---|---|
| **Bats** | swarm a room, startle, scatter | minor wax spill (a turn or two) | Spire / early — teaches that creatures cost light |
| **Rats** | swarm near food and light, gnaw | destroy matches | early–mid |
| **Spiders** | web corridors and doorways | clearing webs costs turns (= wax); block routes | mid |
| **Wolves** | stalk corridors, close in | force a Run; heavy wax spill | mid |
| **Shades** | drift through walls, drain | drain wax / shrink the radius while inside it | mid–late |
| **Light-eater** | a shadow that seeks the flame | snuffs the candle on contact (needs a match) | late |
| **Count Orlok** | the reaper — not fought | triggered only by wax-out (§8); Dread sets how fast he closes | terminal state only |

- **Avoidance, not combat.** Every encounter offers **Run** (spills wax) or **Endure /
  be spooked** (spills wax *and* snuffs the candle — needs a match). No HP, no attack rolls.
- **Escalation is density and mix, not stats.** Deeper floors spawn more of the roster and
  combine types in one room; an individual creature's behaviour never changes.
- **Orlok is not a floor encounter.** He belongs only to the guttering dark and is never
  rolled into the normal roster.

## 8. Loss / win / fail-forward

- **Win (full):** hold the **key**, reach the ground-floor **exit**, and escape the tower
  **on your own light** — the full victory and score.
- **Win (borrowed):** a survivor who reaches the door first leaves it **ajar** for a short
  window — **how long that window lasts depends on how they feel about you (disposition)
  and how much the tower has turned against you (Dread)**; a warm, allied survivor at low
  Dread holds it longer than a hostile one at high Dread. Slipping out through a borrowed
  door is a **lesser ending** ("you slipped out in another's wake") with a **reduced
  score**, and while it stands open the **Dread rises and creatures gather near the exit**.
  The key remains the reliable, self-reliant path.
- **Snuff vs. guttering dark:** a **snuff** (a creature or hazard snuffs the candle) is darkness
  you recover from **provided you hold a match** — re-light and continue. With **no match**, a
  snuff drops you into the **guttering-dark grace** below, the same terminal path as wax-out.
  **Guttering dark** — zero wax — is likewise the terminal state, and the two (snuff vs. guttering)
  must read as visibly and audibly different.
- **Fail-forward (guttering dark):** at zero wax the flame gutters for a few turns —
  radius shrinks, Orlok closes in — and you may still reach a match or the exit. Only
  when that final grace is spent does Orlok take you. **Orlok is triggered only by
  wax-out; Dread sets how fast he closes during the guttering dark.**
- **Game Over:** "Count Orlok takes you." Retry / back to title.

## 9. Progression & difficulty (jam requirements)

- **Beginner-friendly entry, linear curve.** The **Spire** — the first floor played — is
  generous: an early room with extra wax/matches; the first light-tending success lands
  well **inside 30 seconds**.
- **First success < 30s:** the opening beat teaches "find wax, keep the flame" and
  delivers an immediately readable win (a saved candle / first wax found).
- **Near-Miss Bonus:** reward grazing a creature, clearing a hazard as it gives way, or escaping
  with near-zero wax.
- **Zone Bonus:** reward first entry to each new floor/region.
- Escalate **one** variable per floor (creature density, **hazard density**, wax drain,
  **dark rooms**, NPC pressure) — never two new systems at once. A floor's **creature + hazard
  escalation shares a single budget**, and it introduces **at most one new hazard**, mirroring
  the one-new-creature rule (§7). **Dark rooms** are an *environment modifier* (the radius itself
  shrinks), not a hazard.

**Dread tiers (the social escalation dial).** Dread is the one pressure that escalates
with *play* rather than floor. It reads as weather over the tower:

| Dread | State | Effect |
|---|---|---|
| 0–1 | Calm | NPCs start Neutral; Orlok at baseline. |
| 2–3 | Watched | New NPCs start Wary; the dark presses closer. |
| 4–5 | Marked | Warm acts draw the dark closer (a small extra Dread cost); Orlok's search advances. |
| 6–7 | Hunted | No new Ally without atonement first; Orlok's reach widens. |
| 8 | Hunted (full) | Every NPC reads Hostile until you atone; Orlok locks on. |

Social play, Dread, and hazards **arrive on the second floor down, never on the Spire** — the
first floor is a gentle wax-and-exploration tutorial (at most a single teaching creature, bats,
§7), so the beginner rule and the <30s first success hold.
Warm acts stay affordable at every Dread tier, so atonement is never wax-unaffordable and a
cold-built run can always claw back through warm gestures: Dread never hard-locks the player.

## 10. Screens (≥6, per `COMPLIANCE.md`)

Seven screens. Items in **bold** are the AGENTS GDD contract must-haves (music/SFX
toggles, Pause resume + back).

| Screen | Contents |
|---|---|
| **Title** | logo, Start, How to Play |
| **How to Play** | candle-as-clock, move, Run/Endure, warm/cold acts, Dread |
| **Gameplay** | the tower; HUD = wax meter, matches, key, Dread weather |
| **Pause** | **resume**, **back**, **music toggle**, **SFX toggle**, How to Play, quit |
| **Settings** | **music toggle**, **SFX toggle**, reset run, credits |
| **Game Over** | "Count Orlok takes you" — retry / back to title |
| **Victory** | escape (full or borrowed), score breakdown |

Plus in-scene overlays for combat and social encounters (not counted as screens).

## 11. Visual direction notes (feeds `visual_agent`)

**Signature.** The light *is* the artwork. There is no lit room behind a mask — the world
is a **radial candle mask over absolute black**, and the reveal itself is the spectacle.
Compose every frame around the flame, never around the room. Build the canvas in three
passes, in order — **(1) void** (black field, at most a breathing grain), **(2) world**
(stone, props, creatures, survivors drawn full-brightness inside the radius), **(3) mask**
(a radial gradient applied `multiply` that kills everything outside the flame and softens
the edge). Depth comes from the mask and the spill ring, never from a background fill.

- **Palette (≤3 hues on screen).** Keep the known/unknown border instant; never let the
  void drift to grey.
  - **Void** `#000000` → `#0a0708` — absolute black; a whisper of warm only right at the
    flame, never a grey field.
  - **Candle** `#fff3c4` core → `#ffb347` amber → `#c8862a` gold — the main lit pass and
    warm falloff, plus sconce metal and wax.
  - **Stone** `#2e3440` → `#6b7480` — desaturated grey-blue at the radius edge; cold and
    bloodless.
  - **Arterial red** `#8f1d1d` / `#d3382e` — **Orlok, blood, and danger only.** Never
    decoration.
  - **One hue per job:** amber = safety/light, grey-blue = inert cold world, red = threat.
    If a colour is ambiguous it is wrong. Dread shifts the *stone* and *void* values, never
    the flame (§9 tiers).
- **Light & falloff.** Radial gradient mask with a soft edge, plus a second, dimmer
  **spill ring** just outside the main radius so near-things resolve before they pop in.
  Radius is tied to remaining wax, so the frame literally closes in as the candle burns.
  Hold a very low near-black floor (`#0a0708`) inside the outer edge — enough to hint a
  silhouette, never enough to light a room.
- **Flame as a character.** Draw the flame *above* the mask as an additive core + halo so
  it stays the brightest object on screen. Irregular low-amplitude flicker at rest (two or
  three detuned sines, a few px of lean); **guttering** is a slow, wide wobble near zero
  wax; a **snuff** is a hard, instant blackout — a cut to pure void, visibly distinct from
  the slow guttering dark (§8). The flame leans toward movement, toward the room's open
  neighbour, and *away* from Orlok.
- **Gothic vocabulary (and the thing roster).** Arches, iron sconces, caged stairwells,
  warped Expressionist angles, ancestral portraits whose eyes track the flame. Borrow the
  1922 *Nosferatu* look — stark geometric shadows, low-key lighting, long clawed
  silhouettes. Draw the world model's things in-idiom: wax a stubby guttering candle,
  matches a small bundle, the key a heavy iron bow, lore a torn page or scratched stone;
  each creature its own contour (bat cluster, rat run, webbing, wolf, drifting shade, and a
  light-eater that is *absence* with two faint points). In a small radius **silhouette
  reads better than detail** — give every threat a distinct outline first, detail second.
- **Depth inside a tiny radius.** Fake three dimensions with the mask, not a 3D pass:
  nearer props draw larger and slightly brighter; a faint parallax offset between floor and
  wall props; explicit occlusion order (creature in front of stone); and the spill ring
  resolving the next tile before the main radius reaches it. Distant floors never render —
  the void *is* the cull.
- **Materials & texture (only inside the radius).** Procedural, no sample assets: cool
  stone grain and mortar lines, wax drips and pools under sconces, dust motes drifting
  through the light shaft, cobwebs at doorways, floorboards in warped perspective. Texture
  is seasoning — keep its contrast low so it never competes with the flame or the red.
- **Readability (375 px is a hard floor).** Every threat identifiable from its silhouette
  at the radius edge; tiles ≥48 px; body text ≥16 px. Danger uses **shape + silhouette +
  red**, never hue alone (colour-blind safe). Never rely on fine detail to signal danger.
  Unknown tiles stay pure black.
- **Weather legibility.** Wax and Dread read as *atmosphere*: darkness colour and
  saturation shift with Dread tiers (cooler/calm → warmer/closer black), near-miss and
  damage flash red on the mask edge, guttering warms then drops the whole frame, and
  victory floods the exit with clean warm light.
- **HUD in-idiom.** The HUD *is* the candle: the wax meter is a burning candle that
  shortens, matches are drawn matchsticks, the key a drawn key, Dread a weather band in
  the void's own colour ramp. Menus and toggles reuse the stone/iron/amber language — no
  flat modern UI.
- **Motion (reserved).** Turn-based, so movement is punctuation: a ~1-tile eased camera
  glide, a slow "breathing" pulse on the void, a gentle cross-fade between floors/states,
  and nothing that competes with the flame. Honour reduced-motion by dropping the pulse and
  glides to cuts.
- **Technical notes.** Single viewport-scaled canvas, `devicePixelRatio`-aware. Compose the
  mask on an offscreen canvas and blit with `globalCompositeOperation` (e.g. `multiply` /
  `destination-in`) rather than per-pixel JS. All art is procedural (paths, gradients,
  noise) — no external images or fonts. Budget one full redraw per turn plus cheap per-frame
  flame flicker; the void is a fill, not a draw call, and red is a reserved draw pass so it
  is trivially audited.

## 12. Audio direction notes (feeds `audio_agent`)

**Rule zero — silence is a tool.** Horror reads through contrast. Keep the ambient bed at
the edge of hearing so that a *cut to silence* is itself an event, not an absence.

- **The clock you hear.** A consuming fire/tick per wax burn, imperceptibly faster as wax
  drops, so the player *feels* the turn cost before reading the meter. Killing the tick is
  the zero-wax cue.
- **The drone.** One pervasive low-frequency drone (sub-bass plus detuned sines) as the
  floor of the mix, present from the first turn and **rising with Dread tiers** so the
  tower's mood is audible. Music, if any, stays non-diegetic and sparse — reserve it for
  the terminal beats.
- **Direction & distance.** Creature cues — bat squeaks, rat scurry, wolf howl, shade
  whisper — panned by direction and attenuated by distance, and **quieter outside the
  radius**. Orlok's footsteps are the one thing that grows *louder* as light fails.
- **Hazards have a voice.** Each hazard type carries a distinct cue — stone grind (collapsing
  floor), a mechanism click (pressure plate), a low glyph tone (light-glyph and cursed ward) —
  panned and attenuated like creature cues, **quieter outside the radius**. A hazard **snuff**
  is a sharp cutoff (the §8 snuff cue), never the slow swell of the guttering dark.
- **Escalation arc (snuff vs. guttering dark, §8).** *Snuff* = a sharp cutoff plus a lone
  match-strike; *guttering dark* = the drone swells, a heartbeat enters, Orlok's theme
  resolves; *death* = the drone stops dead.
- **Voices.** Five survivors need distinct, minimal voices (a hum, a wheeze, a whisper) so
  disposition changes are audible without dialogue; keep speech low-passed and close.
- **Mix & budget.** Web Audio; procedural where possible (oscillators + noise, no sample
  assets) to keep the single file light; duck the ambience under Orlok's theme.
- **Music/SFX toggles required in Pause and Settings.**

## 13. Input (both mandatory)

- **Touch:** tap adjacent tile to move; tap UI for actions; swipe optional for panels.
- **Mouse:** click to move/act; hover highlights reachable tiles.
- **Optional keyboard:** WASD/arrows/Space only if "full controls" is requested.
- Finger-sized targets (≥48 px); viewport-aware; responsive canvas.

## 14. World-model contract (settled)

Procgen lives **in the game**; `world_agent` authors and `manage_world(convert)` validates a
static **tower template** (room archetypes per the Holotron contract
(`world_template.schema.json`); the connectivity rules between them; and the thing/encounter
roster: wax, matches, key, **hazards**, creatures, NPCs). It emits `world_template.json` +
`world_template.txt`.

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
- **Floors.** The template is **floor-agnostic** — its archetype `count` bounds describe *one*
  generated floor; per-floor escalation (creature density, **hazard density**, wax drain,
  darkness, NPC pressure) is applied by the game, by depth, from the GDD. There is **no
  `floors[]` section**.
- **Stairs & state.** Vertical movement is `down`/`up` exits. Each floor is generated once
  from a per-depth seed (`hash(seed, depth)`), cached, and mutated in place, so backtracking
  returns the floor you changed. `worldState()` reports the **active floor**; the Phase 2
  check validates the **pristine boot state** (pre-mutation), and runtime mutations are a
  separate delta.
- **State vs. simulation.** The game's `window.systemState()` reports the **tower-wide** survivor
  roster and Dread at all times — so the B7 gate reads ≥1 survivor and a non-null Dread clock at
  the **pristine boot state** (the Spire) — while NPC **simulation** (roaming, acting,
  co-location encounters) is **active-floor-only**; the Spire stays **social-free** (§9).
- **Dread** is authored twice: as lore (`key: dread-dial`) for the world model, and as a
  template `clocks[]` `tug_of_war` entry (0–8, with `tiers`) that the game and checker read.
- **Hazards.** A hazard is authored as an `encounter_roster` entry (`kind:"hazard"`,
  `threat`/`effect`/`floor`) and placed in a **non-required room** — the requirement that matters is
  that no required thing shares its room (asserted by `check_template.mjs`, §6.4.1). In this build
  the hazard room is the *second* `scribe-alcove` (a dedicated non-required alcove); adopting a
  hazard-role archetype is a not-yet-taken refinement. `required_encounters` can pin any that must
  be reachable on the test seed. The Phase 2 check covers encounter **presence + reachability**
  (systemic/advisory); connectivity rules remain unvalidated (C7).
- A lore fragment is authored as a readable **thing** (`kind:"lore"`, `readable:true`,
  `read_text`); `read_text` is data rendered as text, **never** HTML.

## 15. Must-haves / must-nots

**Must:**
- Single `index.html`, vanilla JS, embedded HTML/CSS/JS (per `COMPLIANCE.md`).
- Candle-as-clock; wax/matches/key; grace on wax-out; **hazards (avoid costs wax, spring snuffs
  and costs a match; never on a required path; intrinsically telegraphed)**; five NPCs; ~6 social
  actions; a single 0–8 Dread dial; avoidance combat.
- Touch + mouse; responsive; ≥6 screens; music/SFX toggles.
- **Staged delivery:** wave 1 = the **descent core** (candle, wax/matches, key, exit, seeded
  winding floors, one creature type, **the collapsing floor**); wave 2 = **social + Dread**
  (the five survivors, disposition, the Dread dial) **and the remaining hazards** (light-glyph,
  pressure plate, cursed ward, crumbling stair) by density; wave 3 = the **shared-resource
  survivor sim** (NPCs carrying wax, attacked by creatures, tripping hazards, taking/using
  items). **Wave 3 is required for the submission**, and its sub-features (item use, creatures
  attacking NPCs, hazard-tripping) must ship **independently flag-gated** so a flaky sub-feature
  disables at runtime without breaking the build — graceful degradation, never a blanket cut.
  If social is cut, the borrowed-door window (§8) falls back to a fixed, short count.
- **Lore:** wave 1 ships a readable/score fragment; wave 2 makes it the social key
  (disposition / information / safe passage — never wax or matches).

**Must not:**
- No traditional fight-the-monster battle system.
- No hand-authored `index.html`; no bypassing the approval gate.
- No hard death that contradicts the beginner-friendly first-success rule.

---

## 16. Handoff

This brief is creative **direction**, paraphrased into agent prompts and passed to the
pipeline as a **constraint source** — in particular `gdd_agent` receives it (the run's
`direction.txt`) and its output is checked against the must-haves (§15). It is **not**
authoritative on mechanics: the roster's numbers, the floors, and the per-depth escalation
are agent outputs (`gdd.md` / `world_template.json`). The mandatory ideation approval gate
still applies: this brief **constrains** the concept space, it does not pre-select the
concept.
