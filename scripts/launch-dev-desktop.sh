#!/usr/bin/env bash
# Launch the Legacy Immortal about site dev server and open it in Firefox.
#
# Kills any existing process occupying ports 5173-5179, then starts
# `bun run dev` in the background, waits for the server to accept connections,
# then opens Firefox at the correct URL.
#
# Intended to be invoked from a .desktop file so it can run in its own
# session without blocking the desktop environment.

set -euo pipefail

PROJECT_DIR="/mnt/data/workspace/legacyimmortal/about"
BUN="${HOME}/.bun/bin/bun"
LOG_FILE="/tmp/legacy-immortal-about-dev.log"

# Kill any existing processes occupying ports 5173-5179 so Vite can bind cleanly.
for port in $(seq 5173 5179); do
  pid=$(ss -ltnp "sport = :${port}" 2>/dev/null | awk 'NR>1 {match($0, /pid=[0-9]+/); if (RSTART>0) print substr($0, RSTART+4, RLENGTH-4)}' | head -1)
  if [ -n "$pid" ]; then
    echo "Killing existing process on port ${port} (PID ${pid})..." >&2
    kill "$pid" 2>/dev/null || true
  fi
done

sleep 1

# Start the dev server in the background, detached from this shell.
cd "$PROJECT_DIR"
nohup "$BUN" run dev > "$LOG_FILE" 2>&1 &

echo "Started Vite dev server" >&2

# Wait for the dev server to accept connections (up to ~60 seconds).
FOUND_PORT=""
for _ in $(seq 1 60); do
  for port in $(seq 5173 5179); do
    if ss -ltn "sport = :${port}" 2>/dev/null | grep -q ":${port}"; then
      if curl -sL "http://localhost:${port}/" 2>/dev/null | grep -qi "legacy immortal"; then
        FOUND_PORT="$port"
        break 2
      fi
    fi
  done
  sleep 1
done

if [ -z "$FOUND_PORT" ]; then
  echo "Could not start the dev server. See $LOG_FILE" >&2
  exit 1
fi

URL="http://localhost:${FOUND_PORT}/"

# Open the app in Firefox.
nohup firefox "$URL" >/dev/null 2>&1 &
echo "Opened Firefox at $URL" >&2

exit 0
