#!/usr/bin/env node
// Holotron Phase 2 world-model checker (deterministic, zero dependencies).
//
// Validates a game's extracted STATE against a world TEMPLATE.
//   spatial  — the checked world graph (dangling exits, reachability, required things)
//   systemic — the game systems (clocks, NPCs, social actions, encounter roster)
//
// Every systemic assertion is BEHAVIORAL where possible: observed social-log deltas
// must match the declared direction and clamp to the declared bounds. A game that
// merely echoes window.TEMPLATE into window.systemState() will fail these.
//
// Usage:
//   node scripts/check_template.mjs --template <t.json> --state <s.json> [--mode all|spatial|systemic] [--fail-on any|spatial|systemic] [--max-bytes N]
// Exit: 0 = no mismatch in the --fail-on scope (or scope not exercised); 1 = a mismatch in scope.
//   --fail-on (default any) splits the gate: `--fail-on spatial` makes rooms hard while
//   systemic stays advisory (reported, exit 0). Guard mismatches always fail.

import { readFileSync } from 'node:fs';

const DEFAULTS = { mode: 'all', maxBytes: 200_000, failOn: 'any' };

function parseArgs(argv) {
  const o = { ...DEFAULTS };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--template') o.template = argv[++i];
    else if (a === '--state') o.state = argv[++i];
    else if (a === '--mode') o.mode = argv[++i];
    else if (a === '--max-bytes') o.maxBytes = Number(argv[++i]);
    else if (a === '--fail-on') o.failOn = argv[++i];
    else if (a === '--help' || a === '-h') { console.log('usage: node scripts/check_template.mjs --template <t.json> --state <s.json> [--mode all|spatial|systemic] [--fail-on any|spatial|systemic] [--max-bytes N]'); process.exit(0); }
    else { console.error(`unknown argument: ${a}`); process.exit(2); }
  }
  if (!o.template || !o.state) { console.error('error: --template and --state are required'); process.exit(2); }
  if (!['all', 'spatial', 'systemic'].includes(o.mode)) { console.error(`error: bad --mode ${o.mode}`); process.exit(2); }
  if (!['any', 'spatial', 'systemic'].includes(o.failOn)) { console.error(`error: bad --fail-on ${o.failOn}`); process.exit(2); }
  return o;
}

function loadJSON(path, label, mismatches) {
  let raw;
  try { raw = readFileSync(path); }
  catch (e) { mismatches.push({ kind: label, detail: `cannot read ${path}: ${e.message}` }); return null; }
  try { return { data: JSON.parse(raw.toString('utf8')), bytes: raw.length }; }
  catch (e) { mismatches.push({ kind: label, detail: `invalid JSON in ${path}: ${e.message}` }); return null; }
}

function sign(n) { return n > 0 ? 1 : n < 0 ? -1 : 0; }

function checkSpatial(tpl, state, mismatches) {
  const world = state.world && state.world.rooms ? state.world : state;
  const rooms = world.rooms;
  if (!rooms || typeof rooms !== 'object') { mismatches.push({ kind: 'spatial', detail: 'state has no `rooms`' }); return; }
  const start = world.start;
  if (!start || !rooms[start]) mismatches.push({ kind: 'spatial', detail: `start room '${start}' is not present` });

  for (const [slug, room] of Object.entries(rooms)) {
    for (const [dir, to] of Object.entries(room.exits || {})) {
      if (!rooms[to]) mismatches.push({ kind: 'spatial', detail: `dangling exit: ${slug} ${dir} -> '${to}' (no such room)` });
    }
  }

  if (start && rooms[start]) {
    const seen = new Set([start]);
    const queue = [start];
    while (queue.length) {
      const cur = queue.shift();
      for (const to of Object.values(rooms[cur].exits || {})) {
        if (rooms[to] && !seen.has(to)) { seen.add(to); queue.push(to); }
      }
    }
    for (const slug of Object.keys(rooms)) {
      if (!seen.has(slug)) mismatches.push({ kind: 'spatial', detail: `unreachable room: '${slug}'` });
    }
    const required = Array.isArray(tpl.required_things) ? tpl.required_things : [];
    for (const thing of required) {
      let placed = null;
      for (const slug of seen) if ((rooms[slug].things || []).includes(thing)) { placed = slug; break; }
      if (!placed) mismatches.push({ kind: 'spatial', detail: `required thing '${thing}' is not placed on any reachable room` });
    }
  }

  checkArchetypes(tpl, state, mismatches);
  checkPlacement(tpl, state, mismatches);
}

// Invariant: a hazard's room is never required for progress — a room carrying a creature/hazard
// encounter must NOT also hold a required thing (the key/lore). Template-driven: it fires only when
// the template declares a creature/hazard encounter roster, so it is a no-op for games without one.
function checkPlacement(tpl, state, mismatches) {
  const world = state.world && state.world.rooms ? state.world : state;
  const rooms = world.rooms;
  if (!rooms || typeof rooms !== 'object') return;
  const taxing = new Map();
  for (const e of (Array.isArray(tpl.encounter_roster) ? tpl.encounter_roster : [])) {
    if (e && (e.kind === 'creature' || e.kind === 'hazard')) taxing.set(e.id, e.kind);
  }
  if (taxing.size === 0) return; // no taxing encounters declared: scope not exercised
  const required = new Set(Array.isArray(tpl.required_things) ? tpl.required_things : []);
  if (required.size === 0) return;
  for (const [slug, room] of Object.entries(rooms)) {
    const enc = room && room.encounter;
    if (!enc || !taxing.has(enc)) continue;
    const hit = (room.things || []).filter(t => required.has(t));
    if (hit.length) {
      mismatches.push({ kind: 'spatial', detail: `room '${slug}' (${taxing.get(enc)} encounter '${enc}') also holds required thing(s) ${JSON.stringify(hit)} — a hazard room must not be required for progress` });
    }
  }
}

// Archetype role + per-archetype count bounds on the checked (active-floor) state.
// Scope is exercised only when at least one room declares an `archetype`; otherwise the
// state predates the contract and is treated as unexercised, not failed.
function checkArchetypes(tpl, state, mismatches) {
  const world = state.world && state.world.rooms ? state.world : state;
  const rooms = world.rooms;
  if (!rooms || typeof rooms !== 'object') return;
  const archetypes = Array.isArray(tpl.archetypes) ? tpl.archetypes : [];
  if (archetypes.length === 0) return;
  const byId = new Map(archetypes.map(a => [a.id, a]));
  const declared = Object.values(rooms).some(r => r && typeof r.archetype === 'string');
  if (!declared) return; // no room declares an archetype: scope not exercised

  const tally = new Map();
  for (const [slug, room] of Object.entries(rooms)) {
    const arch = room && room.archetype;
    if (typeof arch !== 'string') {
      mismatches.push({ kind: 'spatial', detail: `room '${slug}': missing archetype` });
      continue;
    }
    if (!byId.has(arch)) {
      mismatches.push({ kind: 'spatial', detail: `room '${slug}': archetype '${arch}' is undeclared` });
      continue;
    }
    tally.set(arch, (tally.get(arch) || 0) + 1);
  }

  for (const a of archetypes) {
    const count = a.count;
    if (!Array.isArray(count) || count.length !== 2) continue; // unbounded archetype
    const got = tally.get(a.id) || 0;
    if (got < count[0] || got > count[1]) {
      mismatches.push({ kind: 'spatial', detail: `archetype '${a.id}': ${got} room(s), expected ${count[0]}..${count[1]}` });
    }
  }

  const entry = archetypes.find(a => a.role === 'entry');
  const start = world.start;
  if (entry && start && rooms[start] && rooms[start].archetype !== entry.id) {
    mismatches.push({ kind: 'spatial', detail: `start room '${start}': archetype '${rooms[start].archetype}', expected entry '${entry.id}'` });
  }
}

function checkTiering(clk, mismatches) {
  if (!Array.isArray(clk.tiers) || clk.tiers.length === 0) return;
  const ranges = clk.tiers.map(t => t.range).filter(r => Array.isArray(r) && r.length === 2).sort((a, b) => a[0] - b[0]);
  if (ranges.length !== clk.tiers.length) { mismatches.push({ kind: 'systemic', detail: `clock '${clk.id}': a tier has a malformed range` }); return; }
  if (ranges[0][0] !== clk.min) mismatches.push({ kind: 'systemic', detail: `clock '${clk.id}': tiers start at ${ranges[0][0]}, expected min ${clk.min}` });
  if (ranges[ranges.length - 1][1] !== clk.max) mismatches.push({ kind: 'systemic', detail: `clock '${clk.id}': tiers end at ${ranges[ranges.length - 1][1]}, expected max ${clk.max}` });
  for (let i = 1; i < ranges.length; i++) {
    if (ranges[i][0] !== ranges[i - 1][1] + 1) {
      mismatches.push({ kind: 'systemic', detail: `clock '${clk.id}': tier gap/overlap between [${ranges[i - 1]}] and [${ranges[i]}]` });
    }
  }
}

function checkSystemic(tpl, state, mismatches) {
  const hasSystemic = ['clocks', 'npcs', 'social_actions', 'encounter_roster', 'required_encounters'].some(k => Array.isArray(tpl[k]) && tpl[k].length);
  if (!hasSystemic) return; // nothing declared: scope not exercised
  const sys = state.systems || state.system || {};

  // clocks
  for (const clk of tpl.clocks || []) {
    if (typeof clk.min !== 'number' || typeof clk.max !== 'number' || clk.min > clk.max) {
      mismatches.push({ kind: 'systemic', detail: `clock '${clk.id}': invalid bounds [${clk.min},${clk.max}]` });
    }
    checkTiering(clk, mismatches);
    const got = (sys.clocks || {})[clk.id];
    if (!got) { mismatches.push({ kind: 'systemic', detail: `clock '${clk.id}': missing from systemState` }); continue; }
    if (typeof got.value === 'number' && (got.value < clk.min || got.value > clk.max)) {
      mismatches.push({ kind: 'systemic', detail: `clock '${clk.id}': value ${got.value} out of [${clk.min},${clk.max}]` });
    }
  }

  // npcs
  const sysNpcs = Array.isArray(sys.npcs) ? sys.npcs : [];
  for (const npc of tpl.npcs || []) {
    const got = sysNpcs.find(n => n.id === npc.id);
    if (!got) { mismatches.push({ kind: 'systemic', detail: `npc '${npc.id}' missing from systemState` }); continue; }
    if (Array.isArray(npc.disposition_scale) && npc.disposition_scale.length && !npc.disposition_scale.includes(got.disposition)) {
      mismatches.push({ kind: 'systemic', detail: `npc '${npc.id}': disposition '${got.disposition}' not in ${JSON.stringify(npc.disposition_scale)}` });
    }
    if (Array.isArray(npc.numeric_range) && npc.numeric_range.length === 2 && typeof got.numeric === 'number') {
      if (got.numeric < npc.numeric_range[0] || got.numeric > npc.numeric_range[1]) {
        mismatches.push({ kind: 'systemic', detail: `npc '${npc.id}': numeric ${got.numeric} out of ${JSON.stringify(npc.numeric_range)}` });
      }
    }
  }

  // social actions declared by the template must exist in the game
  const sysActions = Array.isArray(sys.socialActions) ? sys.socialActions : [];
  for (const act of tpl.social_actions || []) {
    if (!sysActions.includes(act.id)) mismatches.push({ kind: 'systemic', detail: `social action '${act.id}' missing from systemState` });
  }

  // observed social-log invariants: direction sign + clamp (cannot be satisfied by echoing the template)
  const dread = (tpl.clocks || []).find(c => c.behavior === 'tug_of_war') || (tpl.clocks || []).find(c => c.id === 'dread');
  for (const obs of Array.isArray(sys.socialLog) ? sys.socialLog : []) {
    const act = (tpl.social_actions || []).find(a => a.id === obs.id);
    if (!act) { mismatches.push({ kind: 'systemic', detail: `socialLog references unknown action '${obs.id}'` }); continue; }
    if (typeof obs.dreadBefore === 'number' && typeof obs.dreadAfter === 'number') {
      const expected = sign(act.dread_delta ?? 0);
      const observed = sign(obs.dreadAfter - obs.dreadBefore);
      if (expected !== 0 && observed !== expected) {
        mismatches.push({ kind: 'systemic', detail: `action '${obs.id}': Dread moved ${obs.dreadBefore}->${obs.dreadAfter} (sign ${observed}), declared ${act.dread_delta} (sign ${expected})` });
      }
      if (dread && (obs.dreadAfter < dread.min || obs.dreadAfter > dread.max)) {
        mismatches.push({ kind: 'systemic', detail: `action '${obs.id}': Dread ${obs.dreadAfter} out of [${dread.min},${dread.max}] (not clamped)` });
      }
    }
  }

  // encounter roster + required encounters present
  const sysEncounters = Array.isArray(sys.encounters) ? sys.encounters : [];
  for (const e of tpl.encounter_roster || []) {
    if (!sysEncounters.includes(e.id)) mismatches.push({ kind: 'systemic', detail: `encounter '${e.id}' missing from systemState` });
  }
  for (const e of tpl.required_encounters || []) {
    if (!sysEncounters.includes(e.id)) mismatches.push({ kind: 'systemic', detail: `required encounter '${e.id}' not present/reachable in systemState` });
  }
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const mismatches = [];
  const tplLoad = loadJSON(opts.template, 'template', mismatches);
  const stateLoad = loadJSON(opts.state, 'state', mismatches);
  if (tplLoad && tplLoad.bytes > opts.maxBytes) {
    mismatches.push({ kind: 'guard', detail: `template is ${tplLoad.bytes} bytes > --max-bytes ${opts.maxBytes}` });
  }
  if (tplLoad && stateLoad) {
    const tpl = tplLoad.data, state = stateLoad.data;
    if (opts.mode === 'all' || opts.mode === 'spatial') checkSpatial(tpl, state, mismatches);
    if (opts.mode === 'all' || opts.mode === 'systemic') checkSystemic(tpl, state, mismatches);
  }
  for (const m of mismatches) console.log(`MISMATCH [${m.kind}] ${m.detail}`);
  const systemic = mismatches.filter(m => m.kind === 'systemic' || m.kind === 'guard').length;
  const spatial = mismatches.filter(m => m.kind === 'spatial').length;
  const isHard = (m) => opts.failOn === 'any' ? true : (m.kind === 'guard' || m.kind === opts.failOn);
  const hard = mismatches.filter(isHard);
  console.log(`\n${mismatches.length} mismatch(es) — spatial ${spatial}, systemic ${systemic} (mode=${opts.mode}, fail-on=${opts.failOn})`);
  console.log(hard.length === 0
    ? `PASS — no ${opts.failOn} mismatch${mismatches.length ? ` (${mismatches.length} advisory)` : ''}`
    : `FAIL — ${hard.length} ${opts.failOn} mismatch(es)`);
  process.exit(hard.length === 0 ? 0 : 1);
}

main();
