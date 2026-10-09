#!/usr/bin/env bash
# Holotron — install a pinned Linux butler into .tools/ (gitignored).
# The canonical host broth.itch.ovh does not resolve on this machine, so we use
# the GitHub release asset instead. Usage: scripts/install-butler.sh
set -euo pipefail

BUTLER_VERSION="${BUTLER_VERSION:-v15.32.0}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEST="$ROOT/.tools/butler"
BIN="$DEST/linux-amd64/butler"

if [ -x "$BIN" ] && "$BIN" --version 2>/dev/null | grep -q "${BUTLER_VERSION#v}"; then
  echo "butler ${BUTLER_VERSION} already installed at $BIN"
  exit 0
fi

mkdir -p "$DEST"
url="https://github.com/itchio/butler/releases/download/${BUTLER_VERSION}/butler-linux-amd64.zip"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

echo "downloading $url"
curl -fsSL "$url" -o "$tmp/butler.zip"
unzip -oq "$tmp/butler.zip" -d "$DEST"
chmod +x "$BIN"
echo "installed: $("$BIN" --version)"
