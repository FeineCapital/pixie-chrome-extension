#!/usr/bin/env bash
# -----------------------------------------------
#  Pixie Installer — double-click me to install
# -----------------------------------------------

cd "$(dirname "$0")"

# Ensure common node/homebrew paths are available
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:$PATH"

clear
echo ""
echo "  ┌──────────────────────────────┐"
echo "  │   Installing Pixie for Mac   │"
echo "  └──────────────────────────────┘"
echo ""

# ── Check for Node.js ──────────────────────────
if ! command -v node &>/dev/null; then
  echo "  ✗  Node.js is required but wasn't found."
  echo ""
  echo "  Opening nodejs.org — install the LTS version,"
  echo "  then double-click this file again."
  echo ""
  open "https://nodejs.org"
  read -rp "  Press Enter to close..."
  exit 1
fi

echo "  ✓  Node.js $(node --version)"
echo ""

# ── Install dependencies ───────────────────────
echo "  Installing dependencies..."
npm install --silent 2>&1 | tail -3
echo ""

# ── Build the .app ─────────────────────────────
echo "  Building Pixie.app (this takes ~30 seconds)..."
npm run build 2>&1 | grep -E "target|building|error|Error" | head -10
echo ""

# ── Open the folder ────────────────────────────
APP=$(find dist -name "Pixie.app" -maxdepth 3 2>/dev/null | head -1)

if [ -n "$APP" ]; then
  echo "  ✓  Pixie.app is ready!"
  echo ""
  echo "  ➜  Drag Pixie into your Applications folder,"
  echo "     then double-click it to launch."
  echo ""
  open "$(dirname "$APP")"
else
  echo "  ✗  Build failed. Check the output above for errors."
fi

echo ""
read -rp "  Press Enter to close..."
