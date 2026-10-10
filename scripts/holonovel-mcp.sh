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

# Pinned Holonovel commit — the world model this fork is validated against.
# Override with HOLOTRON_HOLONOVEL_PIN for a deliberately different checkout.
HOLONOVEL_PIN="${HOLOTRON_HOLONOVEL_PIN:-b6a182a}"

export TTRPG_DATA_DIR="${HOLOTRON_STATE_DIR:-$ROOT/.holonovel-state}"
export TTRPG_SEED="${HOLOTRON_SEED:-holotron}"

mkdir -p "$TTRPG_DATA_DIR"

# Fail loudly on dependency drift. All diagnostics go to stderr so the JSON-RPC
# stream on stdout stays clean. Undeterminable git state warns but does not block.
if command -v git >/dev/null 2>&1 && git -C "$HOLONOVEL_DIR" rev-parse --git-dir >/dev/null 2>&1; then
  HEAD="$(git -C "$HOLONOVEL_DIR" rev-parse --short HEAD 2>/dev/null || echo unknown)"
  case "$HEAD" in
    "$HOLONOVEL_PIN"*) : ;;
    *)
      echo "holonovel-mcp: PIN MISMATCH — $HOLONOVEL_DIR HEAD=$HEAD, expected=$HOLONOVEL_PIN. Set HOLOTRON_HOLONOVEL_PIN to override." >&2
      exit 1
      ;;
  esac
else
  echo "holonovel-mcp: WARNING — cannot verify Holonovel pin (no git repo at $HOLONOVEL_DIR); expected $HOLONOVEL_PIN." >&2
fi

# Prefer the built dist (no tsx transpile/cache); fall back to tsx on source.
if [ -f "$HOLONOVEL_DIR/dist/index.js" ]; then
  exec node "$HOLONOVEL_DIR/dist/index.js"
else
  exec "$HOLONOVEL_DIR/node_modules/.bin/tsx" "$HOLONOVEL_DIR/src/index.ts"
fi
