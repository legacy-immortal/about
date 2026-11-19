#!/usr/bin/env bash
# Launch the Legacy Immortal about site dev server and open it in Firefox.
#
# Reuses an already-running about dev server when found; otherwise kills any
# process occupying ports 5173-5179, starts `bun run dev`, waits for the
# server to accept connections, then opens Firefox at the correct URL.
#
# Intended to be invoked from a .desktop file so it can run in its own
# session without blocking the desktop environment.

set -euo pipefail

PROJECT_DIR="/mnt/data/workspace/legacyimmortal/about"
BUN="${HOME}/.bun/bin/bun"
LOG_FILE="/tmp/legacy-immortal-about-dev.log"

notify() {
  local msg="$1"
  if command -v notify-send >/dev/null 2>&1; then
    notify-send "Legacy Immortal About" "$msg" >/dev/null 2>&1 || true
  fi
}

find_about_port() {
  local port
  for port in $(seq 5173 5179); do
    if ss -ltn "sport = :${port}" 2>/dev/null | grep -q ":${port}"; then
      if curl -fsSL "http://localhost:${port}/about/" 2>/dev/null | grep -qi "legacy immortal"; then
        echo "$port"
        return 0
      fi
    fi
  done
  return 1
}

# If an about dev server is already running, just open it.
if FOUND_PORT="$(find_about_port)"; then
  URL="http://localhost:${FOUND_PORT}/about/"
  nohup firefox "$URL" >/dev/null 2>&1 &
  echo "Opened Firefox at existing dev server $URL" >&2
  exit 0
fi

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
  FOUND_PORT="$(find_about_port || true)"
  if [ -n "$FOUND_PORT" ]; then
    break
  fi
  sleep 1
done

if [ -z "$FOUND_PORT" ]; then
  echo "Could not start the dev server. See $LOG_FILE" >&2
  notify "Could not start the dev server. See $LOG_FILE"
  exit 1
fi

URL="http://localhost:${FOUND_PORT}/about/"

# Open the app in Firefox.
nohup firefox "$URL" >/dev/null 2>&1 &
echo "Opened Firefox at $URL" >&2

exit 0
