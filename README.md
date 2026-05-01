# Face scan (`face_scan`)

All face-scan related work in **`test/face_scan/`** only (no separate `face scan/` or `faceology/` folders).

Web UI + **Python services** for face/skin pipelines (geometry, models, Groq suggestions). Dev skeleton—not production wiring.

## Layout

- `web/` — Vite + React + TypeScript; proxies `/api` → FastAPI on port 8000.
- `services/api/` — FastAPI (`/v1/scan/face`, Groq `/v1/recommendations/faceology`, `/v1/chat/face-report`, etc.).
- `services/worker/` — placeholder for Redis/RQ + job workers.

## Run locally

**One command (recommended)** — frees ports `8000` / `5173`, installs deps, starts API with **`--reload`** (so new routes like Groq are never stale), then Vite:

```bash
cd face_scan   # repo root for this app
./start-dev.sh
```

Open http://127.0.0.1:5173 — upload a photo; AI suggestions need `GROQ_API_KEY` in `services/api/.env`.

**Manual (two terminals)**

API:

```bash
cd services/api
python3 -m venv .venv && . .venv/bin/activate   # optional
pip install -r requirements.txt
python3 -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Web:

```bash
cd web
npm install
npm run dev -- --host 127.0.0.1 --port 5173
```

## Config

Optional `services/api/.env` (see `.env.example`):

```
FACEOLOGY_CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
GROQ_API_KEY=...   # optional AI suggestions
```
