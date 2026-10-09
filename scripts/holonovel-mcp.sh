#!/usr/bin/env bash
# Holonovel world-model MCP server over stdio.
#
# HOLONOVEL_DIR points at a Holonovel checkout (override to relocate).
# State is forced project-local so the shared fork is reproducible and the
# source Holonovel repo is never written. We deliberately key off Holotron-
# specific override vars (HOLOTRON_*) rather than the generic TTRPG_* vars,
# because opencode deep-merges the global `mcp.holonovel` block and would
# otherwise inject its deployed TTRPG_DATA_DIR/TTRPG_SEED into this process.
set -euo pipefail

HOLONOVEL_DIR="${HOLONOVEL_DIR:-/home/fluke/Holonovel-deployed/holonovel}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

export TTRPG_DATA_DIR="${HOLOTRON_STATE_DIR:-$ROOT/.holonovel-state}"
export TTRPG_SEED="${HOLOTRON_SEED:-holotron}"

mkdir -p "$TTRPG_DATA_DIR"

# Prefer the built dist (no tsx transpile/cache); fall back to tsx on source.
if [ -f "$HOLONOVEL_DIR/dist/index.js" ]; then
  exec node "$HOLONOVEL_DIR/dist/index.js"
else
  exec "$HOLONOVEL_DIR/node_modules/.bin/tsx" "$HOLONOVEL_DIR/src/index.ts"
fi
