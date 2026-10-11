(function () {
  'use strict';
  /* Torre Nosferatu autoplay bot (in-page, injected; drives public hooks + DOM only).
   * Defines window.__bot.runBatch(seeds, opts) -> [metrics...].
   * Policies:
   *   optimal - BFS over the full active-floor graph (worldState exposes all rooms).
   *   greedy  - frontier-greedy, NO map memory: only rooms visited or adjacent to a visited
   *             room are "known"; explores to the nearest known-room adjacent to the unknown.
   * Encounter policy: 'run' (always Run) or 'adaptive' (Endure when wax<=8 and a match is held).
   * Arm tuning: opts.tuning overrides window.TUNING = {radiusPenalty, penaltyFloor}.
   */
  function el(id) { return document.getElementById(id); }
  function modal(id) { var e = el(id); return !!(e && e.classList.contains('active')); }
  function anyModal() { return modal('modal-encounter') || modal('modal-social') || modal('modal-journal'); }
  function ts() { return window.testState(); }
  function ws() { return window.worldState(); }
  function roomOf(slug) { var r = ws().rooms; return slug ? r[slug] : null; }
  function neighbors(slug) {
    var r = roomOf(slug); if (!r) return [];
    var out = [], ex = r.exits || {};
    for (var d in ex) { if (roomOf(ex[d])) out.push([d, ex[d]]); }
    return out;
  }
  function bfsPath(from, to, allowed, blocked) {
    if (from === to) return [];
    var q = [[from, []]], seen = {}; seen[from] = 1;
    while (q.length) {
      var c = q.shift(), slug = c[0], path = c[1];
      var nbrs = neighbors(slug);
      for (var i = 0; i < nbrs.length; i++) {
        var d = nbrs[i][0], n = nbrs[i][1];
        if (blocked[slug + ':' + d]) continue;
        if (seen[n]) continue;
        var np = path.concat(d);
        if (n === to) return np;
        if (allowed && !allowed(n)) continue;
        seen[n] = 1; q.push([n, np]);
      }
    }
    return null;
  }
  function resolveModal(opt) {
    if (modal('modal-encounter')) {
      var btns = document.querySelectorAll('#encBtns .mbtn');
      if (btns.length) {
        var desc = el('encDesc') ? el('encDesc').innerHTML : '';
        var creature = /creature blocks|Threat/i.test(desc);
        if (creature) {
          var T = ts();
          var endure = (opt.encPolicy !== 'run') && T.wax <= 8 && T.matches > 0;
          (endure ? btns[1] : btns[0]).click();
        } else { btns[0].click(); } // puzzle: press on
        return true;
      }
    }
    if (modal('modal-social')) {
      var c = el('btn-soc-close');
      if (c) c.click();
      else { var sb = document.querySelector('#socActions .mbtn'); if (sb) sb.click(); }
      return true;
    }
    if (modal('modal-journal')) { var j = el('btn-journal-close'); if (j) j.click(); return true; }
    return false;
  }
  function keyInfo(rooms) {
    var keyRoom = null, stairRoom = null;
    for (var s in rooms) {
      var th = rooms[s].things || [];
      if (th.indexOf('floor-key') >= 0 && !keyRoom) keyRoom = s;
      if (rooms[s].archetype === 'descending-stair' && !stairRoom) stairRoom = s;
    }
    return { keyRoom: keyRoom, stairRoom: stairRoom };
  }
  function chooseStep(T, opt, visited, known, blocked) {
    var rooms = ws().rooms, cur = T.pos;
    var keyHeld = T.floorKey && T.floorKey[T.depth];
    var ki = keyInfo(rooms);
    var refillRoom = null;
    for (var s0 in rooms) { if ((rooms[s0].things || []).indexOf('wax-cake') >= 0) { refillRoom = s0; break; } }
    var greedy = (opt.policy !== 'optimal');
    var knownOrVisited = function (s) { return visited[s] || known[s]; };
    // Goal priority: grab wax when low -> key -> stair.
    var goal = null;
    if (T.wax <= 14 && refillRoom && (!greedy || knownOrVisited(refillRoom))) goal = refillRoom;
    else if (!keyHeld) goal = ki.keyRoom;
    else goal = ki.stairRoom;
    var allowed = greedy ? knownOrVisited : null;
    if (goal) {
      if (greedy && !knownOrVisited(goal)) goal = null; // unknown -> explore
      else {
        var p = bfsPath(cur, goal, allowed, blocked);
        if (p && p.length) return p[0];
      }
    }
    // explore: nearest visited/known room with an exit to an unknown room
    var frontier = [];
    for (var s in rooms) {
      if (!(visited[s] || known[s])) continue;
      var nb = neighbors(s);
      for (var i = 0; i < nb.length; i++) {
        if (!visited[nb[i][1]] && !known[nb[i][1]]) { frontier.push({ room: s, into: nb[i][1] }); break; }
      }
    }
    var best = null;
    for (var f = 0; f < frontier.length; f++) {
      var pp = bfsPath(cur, frontier[f].room, function (slug) { return visited[slug] || known[slug]; }, blocked);
      if (pp && (!best || pp.length < best.path.length)) best = { path: pp, into: frontier[f].into };
    }
    if (best) {
      if (best.path.length) return best.path[0];
      var dirs = neighbors(cur);
      for (var k = 0; k < dirs.length; k++) if (dirs[k][1] === best.into) return dirs[k][0];
    }
    // fallback: any unblocked neighbour
    var nbrs = neighbors(cur);
    for (var m = 0; m < nbrs.length; m++) if (!blocked[cur + ':' + nbrs[m][0]]) return nbrs[m][0];
    return null;
  }
  function playOne(seed, opt) {
    opt = opt || {};
    var m = {
      seed: seed, policy: opt.policy || 'greedy', encPolicy: opt.encPolicy || 'adaptive',
      outcome: 'stuck', maxDepth: 1, turn: 0, waxStart: 0, waxEnd: 0, refills: 0,
      matchesConsumed: 0, snuffs: 0, keysPicked: 0, ghostKeys: 0, lowVisTurns: 0,
      encounters: 0, blockedEvents: 0
    };
    try { window.setSeed(seed >>> 0); } catch (e) { m.outcome = 'boot-error'; return m; }
    ['modal-encounter', 'modal-social', 'modal-journal'].forEach(function (id) { var e = el(id); if (e) e.classList.remove('active'); });
    var bs = el('btn-start'); if (bs) bs.click();
    var T0 = ts(); m.waxStart = T0.wax;
    var visited = {}, known = {}, blocked = {};
    var prevSnuff = T0.snuffed, prevMatches = T0.matches;
    visited[T0.pos] = 1; known[T0.pos] = 1;
    neighbors(T0.pos).forEach(function (n) { known[n[1]] = 1; });
    var guard = 0;
    while (guard++ < 700) {
      var T = ts();
      if (T.depth > m.maxDepth) m.maxDepth = T.depth;
      if (T.won) { m.outcome = (T.wonType === 'full') ? 'full' : 'borrowed'; break; }
      if (T.dead) { m.outcome = 'dead'; break; }
      if (anyModal()) { resolveModal(opt); continue; }
      if ((T.snuffed || T.guttering) && T.matches > 0 && !(T.guttering && T.wax <= 0)) {
        var b = el('btn-usematch');
        if (b && b.style.display !== 'none') { b.click(); m.matchesConsumed++; continue; }
      }
      if (T.snuffed && !prevSnuff) m.snuffs++;
      prevSnuff = T.snuffed;
      if (T.matches < prevMatches) { /* consumed (relight or rats) */ }
      prevMatches = T.matches;
      if (T.effRadius <= 1 && !T.snuffed && !T.guttering) m.lowVisTurns++;

      var here = roomOf(T.pos);
      if (here && here.archetype === 'descending-stair' && T.floorKey && T.floorKey[T.depth]) {
        var db = el('btn-descend');
        if (db && db.style.display !== 'none') { db.click(); continue; }
      }
      var dir = chooseStep(T, opt, visited, known, blocked);
      if (!dir) { m.outcome = 'stuck-nopath'; break; }
      var target = here.exits[dir];
      var tr = roomOf(target);
      var beforeThings = tr ? (tr.things || []).slice() : [];
      var ok = window.move(dir);
      if (!ok) {
        if (anyModal()) { m.encounters++; resolveModal(opt); continue; }
        blocked[T.pos + ':' + dir] = 1; m.blockedEvents++; // locked gate / invalid
        continue;
      }
      var T2 = ts();
      // key pickup frees blocked gates
      if (T2.floorKey && T2.floorKey[T2.depth] && !(T.floorKey && T.floorKey[T.depth])) blocked = {};
      var afterThings = (roomOf(target) ? (roomOf(target).things || []) : []);
      if (beforeThings.indexOf('floor-key') >= 0 && afterThings.indexOf('floor-key') < 0) m.keysPicked++;
      if (beforeThings.indexOf('wax-cake') >= 0 && afterThings.indexOf('wax-cake') < 0) m.refills++;
      visited[target] = 1; known[target] = 1;
      neighbors(target).forEach(function (n) { known[n[1]] = 1; });
    }
    var TE = ts(); m.turn = TE.turn; m.waxEnd = TE.wax; m.ghostKeys = Math.max(0, m.keysPicked - m.maxDepth);
    if (m.outcome === 'stuck' && guard >= 700) m.outcome = 'cap';
    return m;
  }
  window.__bot = {
    runBatch: function (seeds, opt) {
      opt = opt || {};
      if (opt.tuning) window.TUNING = Object.assign({}, window.TUNING, opt.tuning);
      if (opt.wax) {
        // live-tune the wax pool (WAXR/WAXCLK are references into TEMPLATE)
        try {
          var R = window.TEMPLATE.resources.wax, C = window.TEMPLATE.clocks.filter(function (c) { return c.id === 'wax'; })[0];
          if (opt.wax.start != null) R.start = opt.wax.start;
          if (opt.wax.max != null) { R.max = opt.wax.max; if (C) C.max = opt.wax.max; }
          if (opt.wax.refill != null) window.TUNING.refill = opt.wax.refill;
        } catch (e) { /* ignore */ }
      }
      var out = [];
      for (var i = 0; i < seeds.length; i++) out.push(playOne(seeds[i], opt));
      return out;
    },
    playOne: playOne
  };
  return 'bot-injected';
})()
