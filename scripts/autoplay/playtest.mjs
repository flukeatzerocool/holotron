#!/usr/bin/env node
// Torre Nosferatu autoplay harness — zero-dependency driver.
//
// Drives the REAL game in a headless browser via the public hooks
// (worldState/systemState/testState/move) plus DOM modal clicks, injects
// scripts/autoplay/bot.js, and runs a seed batch per (arm, policy).
//
// Requires: `playwright-cli` on PATH (or via npx) + a Firefox browser
// (`npx playwright-cli install firefox`). Preflight fails loudly otherwise.
//
// Usage:
//   node scripts/autoplay/playtest.mjs --game <index.html> [--seeds N]
//        [--policies optimal,greedy] [--arms A,B] [--enc adaptive|run]
//        [--out <prefix>]
//
// Arms (radius curve):
//   A = flattened template default (visibility-first)
//   B = original collapsing curve  penalty [[24,0],[18,1],[12,2],[6,3],[1,4]], floor 1

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { execFileSync, spawn } from 'node:child_process';
import path from 'node:path';

const CWD = process.cwd();

function parseArgs(argv) {
  const o = { seeds: 50, policies: 'optimal,greedy', arms: 'A', enc: 'adaptive', out: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--game') o.game = argv[++i];
    else if (a === '--seeds') o.seeds = argv[++i];
    else if (a === '--policies') o.policies = argv[++i];
    else if (a === '--arms') o.arms = argv[++i];
    else if (a === '--enc') o.enc = argv[++i];
    else if (a === '--out') o.out = argv[++i];
    else if (a === '--base-seed') o.baseSeed = Number(argv[++i]);
    else if (a === '--wax-start') o.waxStart = Number(argv[++i]);
    else if (a === '--wax-max') o.waxMax = Number(argv[++i]);
    else if (a === '--refill') o.refill = Number(argv[++i]);
    else { console.error(`unknown arg: ${a}`); process.exit(2); }
  }
  if (!o.game) { console.error('error: --game <path to index.html> is required'); process.exit(2); }
  return o;
}

const ARMS = {
  A: null, // template default (flattened)
  B: { radiusPenalty: [[24, 0], [18, 1], [12, 2], [6, 3], [1, 4]], penaltyFloor: 1 }
};

function cli(args) {
  try {
    return execFileSync('npx', ['--no-install', 'playwright-cli', ...args], {
      encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe']
    });
  } catch (e) {
    if (e && e.stdout) process.stderr.write(String(e.stdout));
    if (e && e.stderr) process.stderr.write(String(e.stderr));
    throw e;
  }
}
function cliRaw(args) {
  return execFileSync('npx', ['--no-install', 'playwright-cli', '--raw', ...args], {
    encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe']
  }).trim();
}
// playwright-cli --raw prints a string result JSON-encoded; tolerate both shapes.
function parseEval(raw) {
  let v = raw.trim();
  let s = v;
  try { s = JSON.parse(v); } catch (e) { /* already raw text */ }
  if (typeof s === 'string') { try { return JSON.parse(s); } catch (e) { return s; } }
  return s;
}

function median(a) {
  if (!a.length) return 0;
  const b = a.slice().sort((x, y) => x - y);
  const m = Math.floor(b.length / 2);
  return b.length % 2 ? b[m] : (b[m - 1] + b[m]) / 2;
}
function summarize(runs) {
  const n = runs.length || 1;
  const cnt = {};
  runs.forEach(r => { cnt[r.outcome] = (cnt[r.outcome] || 0) + 1; });
  const complete = (cnt.full || 0) + (cnt.borrowed || 0);
  return {
    n: runs.length,
    outcomes: cnt,
    completion: complete / n,
    full: (cnt.full || 0) / n,
    borrowed: (cnt.borrowed || 0) / n,
    dead: (cnt.dead || 0) / n,
    stuck: ((cnt.stuck || 0) + (cnt['stuck-nopath'] || 0) + (cnt['stuck-blocks'] || 0) + (cnt.cap || 0)) / n,
    medianTurns: median(runs.map(r => r.turn)),
    medianMaxDepth: median(runs.map(r => r.maxDepth)),
    medianWaxEnd: median(runs.map(r => r.waxEnd)),
    medianSurplusPct: median(runs.map(r => r.waxEnd / (r.waxStart || 30))),
    meanLowVisTurns: runs.reduce((s, r) => s + r.lowVisTurns, 0) / n,
    totalGhostKeys: runs.reduce((s, r) => s + r.ghostKeys, 0),
    totalSnuffs: runs.reduce((s, r) => s + r.snuffs, 0),
    totalRefills: runs.reduce((s, r) => s + r.refills, 0)
  };
}

async function main() {
  const o = parseArgs(process.argv.slice(2));
  const gamePath = path.resolve(o.game);
  if (!existsSync(gamePath)) { console.error(`game not found: ${gamePath}`); process.exit(2); }
  const gameDir = path.dirname(gamePath);
  const gameFile = path.basename(gamePath);

  // preflight
  try { cli(['--version']); }
  catch (e) { console.error('[preflight] playwright-cli not available via npx --no-install playwright-cli. Install: npm i -g @playwright/cli'); process.exit(3); }

  // static server in a SEPARATE process (execFileSync blocks this event loop)
  const port = 8100 + Math.floor(Math.random() * 800);
  const serverCode = "const h=require('http'),f=require('fs'),p=require('path');" +
    "const dir=process.argv[1],file=process.argv[2],port=process.argv[3];" +
    "h.createServer((q,s)=>{let u=q.url.split('?')[0];if(u==='/')u='/'+file;" +
    "try{const d=f.readFileSync(p.join(dir,u));s.writeHead(200,{'Content-Type':'text/html'});s.end(d);}" +
    "catch(e){s.writeHead(404);s.end('nf');}}).listen(port,'127.0.0.1');";
  const srv = spawn(process.execPath, ['-e', serverCode, gameDir, gameFile, String(port)], { detached: true, stdio: 'ignore' });
  srv.unref();
  await new Promise(r => setTimeout(r, 700));
  const url = `http://127.0.0.1:${port}/${gameFile}?t=${Date.now()}`;

  const baseSeed = o.baseSeed || 20261010;
  const nSeeds = Math.max(1, parseInt(o.seeds, 10) || 50);
  const seeds = Array.from({ length: nSeeds }, (_, i) => (baseSeed + i) >>> 0);
  const policies = o.policies.split(',').map(s => s.trim()).filter(Boolean);
  const arms = o.arms.split(',').map(s => s.trim()).filter(Boolean);

  try { cli(['close-all']); } catch (e) { /* ignore */ }
  try { cli(['open', '--browser=firefox']); }
  catch (e) { console.error('[preflight] failed to open Firefox. Run: npx playwright-cli install firefox'); throw e; }
  cli(['goto', url]);

  const botSrc = readFileSync(new URL('./bot.js', import.meta.url), 'utf8');
  parseEval(cliRaw(['eval', botSrc]));

  const results = [];
  for (const arm of arms) {
    const tuning = ARMS[arm] || null;
    for (const policy of policies) {
      const opt = { policy, encPolicy: o.enc, tuning };
      if (o.waxStart != null || o.waxMax != null || o.refill != null) {
        opt.wax = {};
        if (o.waxStart != null) opt.wax.start = o.waxStart;
        if (o.waxMax != null) opt.wax.max = o.waxMax;
        if (o.refill != null) opt.wax.refill = o.refill;
      }
      const expr = `JSON.stringify(window.__bot.runBatch(${JSON.stringify(seeds)}, ${JSON.stringify(opt)}))`;
      const runs = parseEval(cliRaw(['eval', expr]));
      if (!Array.isArray(runs)) { console.error(`unexpected batch result for arm ${arm}/${policy}:`, runs); process.exit(4); }
      results.push({ arm, policy, encPolicy: o.enc, runs, summary: summarize(runs) });
      console.error(`[done] arm ${arm} · ${policy} · ${runs.length} runs`);
    }
  }

  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const prefix = o.out || `${gameDir}/playtest_${ts}`;
  const report = { meta: { game: gamePath, generated: new Date().toISOString(), baseSeed, seeds, arms, policies, enc: o.enc }, results };
  writeFileSync(prefix + '.json', JSON.stringify(report, null, 2));

  // summary
  const lines = [];
  lines.push(`# Autoplay report — ${path.relative(CWD, gamePath)}`);
  lines.push(`seeds: ${seeds.length} (${seeds[0]}..${seeds[seeds.length - 1]})  arms: ${arms.join(',')}  policies: ${policies.join(',')}  enc: ${o.enc}`);
  lines.push('');
  lines.push('arm policy   n  complete  full  borrowed  dead   stuck  medTurn  medDepth  medWaxEnd  medSurplus%  lowVisTurn  ghostKeys  snuffs');
  for (const r of results) {
    const s = r.summary;
    const pct = (x) => (x * 100).toFixed(1).padStart(5) + '%';
    lines.push(
      `${r.arm.padEnd(3)} ${r.policy.padEnd(8)} ${String(s.n).padStart(2)}  ${pct(s.completion)}   ${pct(s.full)} ${pct(s.borrowed)}  ${pct(s.dead)} ${pct(s.stuck)}  ${String(s.medianTurns).padStart(6)}  ${String(s.medianMaxDepth).padStart(7)}  ${String(s.medianWaxEnd).padStart(8)}  ${(s.medianSurplusPct * 100).toFixed(1).padStart(9)}%  ${s.meanLowVisTurns.toFixed(1).padStart(9)}  ${String(s.totalGhostKeys).padStart(9)}  ${String(s.totalSnuffs).padStart(6)}`
    );
  }
  lines.push('');
  // bar: greedy arm-A completion >= 0.8 and median surplus >= 0.15
  const greedyA = results.find(r => r.arm === 'A' && r.policy === 'greedy');
  if (greedyA) {
    const s = greedyA.summary;
    const passC = s.completion >= 0.8, passS = s.medianSurplusPct >= 0.15, passK = s.totalGhostKeys === 0;
    lines.push(`SUCCESS BAR (greedy, arm A): completion ${(s.completion * 100).toFixed(1)}% >= 80% -> ${passC ? 'PASS' : 'FAIL'}`);
    lines.push(`                             median surplus ${(s.medianSurplusPct * 100).toFixed(1)}% >= 15% -> ${passS ? 'PASS' : 'FAIL'}`);
    lines.push(`                             ghost keys ${s.totalGhostKeys} == 0 -> ${passK ? 'PASS' : 'FAIL'}`);
    lines.push(`VERDICT: ${(passC && passS && passK) ? 'PASS' : 'FAIL'}`);
  }
  const summaryText = lines.join('\n');
  writeFileSync(prefix + '_summary.txt', summaryText + '\n');
  console.log(summaryText);

  try { cli(['close-all']); } catch (e) { /* ignore */ }
  try { process.kill(-srv.pid, 'SIGTERM'); } catch (e) { /* ignore */ }
  process.exit(0);
}

main().catch(e => { console.error(e && e.stack || e); process.exit(1); });
