#!/usr/bin/env bash
# Start Face scan API (8000) + Vite (5173) from repo root. Ctrl+C stops both.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
API_DIR="$ROOT/services/api"
WEB_DIR="$ROOT/web"

free_port() {
  local port="$1"
  if command -v fuser >/dev/null 2>&1; then
    fuser -k "${port}/tcp" 2>/dev/null || true
  fi
}

echo "Face scan dev — freeing 8000 / 5173 (stale servers cause 404 on Groq / blank UI)"
free_port 8000
free_port 5173
sleep 0.4

echo "Python deps (services/api)…"
cd "$API_DIR"
python3 -m pip install -q -r requirements.txt

echo "npm deps (web)…"
cd "$WEB_DIR"
if [[ ! -d node_modules ]]; then
  npm install
fi

echo "Starting API http://127.0.0.1:8000 …"
cd "$API_DIR"
python3 -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000 &
API_PID=$!

cleanup() {
  echo ""
  echo "Stopping API (pid $API_PID)…"
  kill "$API_PID" 2>/dev/null || true
  wait "$API_PID" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

# Wait until API accepts connections
for _ in $(seq 1 40); do
  if curl -sf "http://127.0.0.1:8000/health" >/dev/null 2>&1; then
    break
  fi
  sleep 0.15
done

if ! curl -sf "http://127.0.0.1:8000/openapi.json" | python3 -c "
import sys, json
p = json.load(sys.stdin).get('paths', {})
assert '/v1/recommendations/faceology' in p
assert '/v1/chat/face-report' in p
" 2>/dev/null; then
  echo "ERROR: API routes missing (recommendations or chat) — check services/api/app/main.py"
  exit 1
fi

echo "Starting web http://127.0.0.1:5173 …"
cd "$WEB_DIR"
npm run dev -- --host 127.0.0.1 --port 5173
