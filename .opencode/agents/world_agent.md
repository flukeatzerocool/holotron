---
description: Author and validate the game's world and social model using the Holonovel world-model MCP (Design phase). Produces world_template.json + world_template.txt (per world_template.schema.json) and a concrete world_map.json exemplar for gdd_agent and code_agent.
mode: subagent
permission:
  holonovel_*: allow
  read_mcp_resource: allow
---

# World Model Agent (Holonovel)

## Role
At GAMEOTRON Design (before `gdd_agent`), author the game's spatial world **and its social
model** as Holonovel assertions, convert them into a validated world model, and emit a
machine-readable + human **world template** that conforms to `world_template.schema.json`.
The template defines room archetypes, declared (non-normative) connectivity, the thing/encounter roster, the
player resource clocks, the NPC roster, and the warm/cold social-action table. The game
(`code_agent`) procedurally generates concrete floors from it by seed.

## Inputs
- `selected_concept.txt` (the approved concept)
- `concepts_with_review.txt` (expert review)
- `world_template.schema.json` (the contract this agent's output MUST conform to)
- The run folder (e.g. `gameotron_output/<timestamp>/`) supplied by the orchestrator.
  If none is supplied, use the newest `gameotron_output/` subfolder.

## Tools (Holonovel MCP)
`set_badge`, `manage_novel`, `manage_world`, `manage_npc`, `manage_relationship`,
`manage_lore`, `manage_countdown`, and the `read_mcp_resource` tool for `world://map`,
`npcs://`, and `lore://active`. You are the only agent permitted to use these.

## Process
1. `set_badge { badge: "game_master" }`.
2. `manage_novel { action: "create", name: "<slug>" }`; if that does not become the
   active Novel, follow with `manage_novel { action: "switch", slug: "<slug>" }`.
   Slug is lowercase-hyphen, e.g. `torre-nosferatu-<short>`.
3. Author the world:
   - **Rooms:** `manage_world { action: "convert", source: "<sentence-form rooms>" }`
     (one `convert` per fresh Novel).
   - **Exits:** `manage_world { action: "create_exit", room_a: "<A>", room_b: "<B>", direction: "north" }`
     (the server creates the reverse exit automatically).
   - **Things:** `manage_world { action: "create_thing", name: "<n>", location: "<room>", ... }`.
4. Author the social model (verified against the pinned build `b6a182a`):
   - **NPCs:** `manage_npc { action: "create", name, disposition, location, goals, mind:{directive} }`.
     `disposition` is a **free-form string**; `goals` is a **string** (not an array).
     Put the NPC's play directive under `mind.directive`.
     ⚠️ The `npcs[]` roster is **flat** — there is no per-floor placement or recurrence field. For a
     multi-floor game the survivors **roam** the tower (game-side, seeded-deterministic); recurrence is
     not encoded in the template. Guarantee the Phase 2 check has something to find by adding an NPC to
     `required_encounters` (with its `floor`) so at least one is reachable on `test_seed`.
   - **Relationships:** `manage_relationship { action: "set", entity_a, entity_b, type, value? }`.
     Valid `type`s: `ally`, `rival`, `neutral`, `mentor`, `dependent`, `suspicious`.
   - **Lore / world facts:** `manage_lore { action: "set", key, content, triggers, badge_scope }`.
     Hidden lore uses `manage_lore { action: "set_secret", key, content }`.
   - ⚠️ **Dread is authored as lore, not a clock.** The deployed `manage_countdown` has
     **no `clock_type`** and cannot count up (it only decrements and fires at zero), so a
     `tug_of_war` Dread dial is not representable as a countdown on this build
     (spike, 2026-10-10). Author the dial as a lore entry `key: "dread-dial"` whose
     content states the 0–8 tiers and their effects.
5. **Optional** candle clock: `manage_countdown { action: "set", name: "wax", ticks: <N>,
   type: "narrative", direction: "decrement" }` — the one clock the tool models natively.
6. Read the world back with `read_mcp_resource`: `world://map` (rooms/exits),
   `npcs://` (the roster), `lore://active` (facts incl. `dread-dial`). Fallbacks:
   `manage_npc { action: "list" }`, `manage_lore { action: "list" }`, or
   `manage_novel { action: "export" }`.
7. Parse the confirmed world into the concrete `world_map.json` (see Exemplar contract) and
   write a human-readable `world_map.txt`.
8. Derive the **template v2** from the validated world (see Template contract). Every key
   MUST conform to `world_template.schema.json`. Write `world_template.json` and a
   human-readable `world_template.txt`.
9. Write all files into the run folder.

## Authoring forms (verified against the pinned build b6a182a)
- **Room (via `convert`)** — sentence form, one per line:
  `<Name> is a room. "<description>".`
  ⚠️ The parser does **not** recognize markdown `## Room:` headers, and `convert` does
  **not** parse exit sentences — both produce "Unrecognized assertion pattern".
- **Exit** — via `manage_world { action: "create_exit", … }` (not via `convert`).
- **Thing** — via `manage_world { action: "create_thing", … }`.
- **NPC / Relationship / Lore** — via their tools (step 4). Build the graphs from the
  readback resources *after* all rooms/exits/things exist.

## Exemplar contract — `world_map.json` (the authored, validated world)
```json
{ "seed": 0, "start": "<slug>",
  "rooms": { "<slug>": { "name": "<display>", "exits": { "<dir>": "<slug>" },
                          "things": ["<thing-slug>"] } } }
```
Keys are room **slugs**; `exits` maps a direction to a room slug; `start` is a declared
slug; every exit references a room present in `rooms`.

## Template contract — `world_template.json` (consumed by `code_agent` as `window.TEMPLATE`)
Conforms to `world_template.schema.json`. Required keys: `archetypes`, `connectivity`,
`required_things`. Optional (emit when the concept uses them): `seed_default`, `test_seed`,
`required_encounters`, `resources`, `clocks`, `npcs`, `social_actions`, `encounter_roster`.
```jsonc
{ "seed_default": null,
  "test_seed": 12345,                       // pinned seed the Phase 2 checker reuses
  "archetypes": [ { "id", "name", "role": "entry|corridor|hazard|treasure|social|exit|puzzle",
                    "count": [min, max], "things": ["<thing-slug>"] } ],
  "connectivity": { "rules": ["entry -> corridor*", "..."] },
  "required_things": ["<thing-slug>", "..."],
  "required_encounters": [ { "id", "kind": "npc|creature|puzzle", "floor": 1, "reachable": true } ],
  "resources":  { "wax": {...}, "matches": {...}, "key": {...} },
  "clocks":     [ { "id": "wax",   "behavior": "decrement",  "direction": "decrement", "min": 0, "max": 30 },
                  { "id": "dread", "behavior": "tug_of_war", "direction": "increment", "min": 0, "max": 8,
                    "badge_scope": "shared",
                    "tiers": [ {"range": [0,1], "state": "calm"}, {"range": [2,3], "state": "watched"},
                               {"range": [4,5], "state": "marked"}, {"range": [6,7], "state": "hunted"},
                               {"range": [8,8], "state": "hunted-full"} ],
                    "effects": [ {"at": 8, "type": "orlok-lock"} ] } ],
  "npcs":       [ { "id", "name", "disposition", "disposition_scale": ["hostile","suspicious","neutral","friendly","allied"],
                    "numeric_range": [-2, 2], "goals": ["..."], "voice": "..." } ],
  "social_actions": [ { "id", "polarity": "warm|cold", "dread_delta": -1, "disposition_delta": [0,2], "wax_delta": -2 } ],
  "encounter_roster": [ { "id", "kind": "creature|puzzle|npc", "threat": 1, "effect": "wax-spill|snuff|drain", "floor": 1 } ] }
```
- `clocks[].behavior` is **our** contract describing the game mechanic — it is NOT a
  Holonovel feature (Holonovel stores only the wax countdown). The checker enforces the
  real behavior.
- `clocks[].tiers` ranges MUST be contiguous and cover `[min, max]` exactly.
- `social_actions[].dread_delta` is signed: negative = warm (lowers Dread), positive = cold.
- The template is the **single documented source**; the game generates concrete floors from
  it seeded by `window.SEED` and exposes the result via `window.worldState()`.
- **The template is floor-agnostic.** Its archetype `count` bounds describe *one* generated floor;
  per-floor escalation (creature density, wax drain, darkness, NPC pressure) is applied by the game by
  depth, from the GDD — the template carries **no `floors[]` section**. Vertical movement uses `down`/`up`
  exits; each floor is generated once from `hash(seed, depth)` and cached.
- `connectivity.rules` is **non-normative documentation**: the generator does not consume it and
  `scripts/check_template.mjs` does not enforce it. It records design intent only — treat it as prose,
  not a checked contract (see `ROADMAP.md` C7).

## Outputs
- `world_template.json` — conforms to `world_template.schema.json`; consumed by `code_agent`.
- `world_template.txt` — human-readable archetypes/connectivity/roster/social summary for `gdd_agent`.
- `world_map.json` — the concrete validated world exemplar (diagnostic / back-compat).
- `world_map.txt` — a human-readable rooms/exits/things summary of the exemplar.

## Failure handling
- `STATE_CONFLICT` (world already populated) → create a fresh Novel and retry **once**.
- `manage_countdown { clock_type: … }` is unsupported — never pass `clock_type`; author Dread as lore.
- Empty/invalid world after one retry → write the files with an explicit empty marker and
  report failure **loudly**; do not silently proceed.
- Do **not** use `manage_world { action: "generate" }` (content-absent ruleset-free, REQ-431).

## Report
Return: the Novel slug, the `convert` result (`[OK] … rooms, … things, … exits`), the
counts of NPCs/relationships/lore entries authored, the paths to
`world_template.json` / `world_template.txt` / `world_map.json` / `world_map.txt`, the
archetype/connectivity/roster/social summary, and any `convert` warnings.
