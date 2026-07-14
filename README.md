# InternSync — Internship Task Tracker

A production-style full-stack CRUD application for tracking internship tasks: dashboard KPIs, dual-view task management (table/card), Kanban drag-and-drop, and an automated activity audit trail.

## Stack

- **Backend:** FastAPI, SQLAlchemy 2.0, Pydantic v2, SQLite (swappable to PostgreSQL via `DATABASE_URL`)
- **Frontend:** React 18 + TypeScript (strict), Tailwind CSS, React Router, Axios, @dnd-kit, Recharts, React Toastify

## Running the backend

```bash
cd backend
python -m venv .venv
.venv/Scripts/activate        # Windows
pip install -r requirements.txt
python init_db.py             # optional: tables are also created automatically on startup
uvicorn app.main:app --reload --port 8000
```

API docs available at `http://127.0.0.1:8000/docs`.

## Running the frontend

```bash
cd frontend
npm install
npm run dev
```

The Vite dev server runs on `http://127.0.0.1:5173` and proxies `/api` requests to the backend on port 8000.

## Deploying

Render's free web services don't support persistent disks, so SQLite isn't viable there (data would reset on every restart). The deployed backend uses Postgres instead — locally, SQLite is still the default via `DATABASE_URL`.

**Database → Neon (free Postgres).** Create a free project at [neon.tech](https://neon.tech), then copy the connection string (starts with `postgresql://...`, includes `?sslmode=require`).

**Backend → Render.** This repo includes a `render.yaml` blueprint: on Render, choose "New > Blueprint", point it at this GitHub repo. Render provisions a free web service; it will prompt you for two env vars since they're marked `sync: false`:
- `DATABASE_URL` — the Neon connection string from above
- `ALLOWED_ORIGINS` — your Vercel frontend URL (comma-separated if more than one), e.g. `https://internsync.vercel.app`

**Frontend → Vercel.** Import this repo as a Vercel project with root directory `frontend` (framework preset: Vite). Set the `VITE_API_BASE_URL` env var to your Render backend's URL plus `/api`, e.g. `https://internsync-api.onrender.com/api`, then deploy. `vercel.json` handles SPA client-side routing rewrites.

Note: Render's free tier spins down on inactivity, so the first request after idling can take ~30-60s to wake up.

## Project layout

```
backend/
  app/
    main.py        FastAPI app, CORS, startup table creation
    database.py     Engine/session/get_db dependency
    models.py       SQLAlchemy models (Task, ActivityLog)
    schemas.py       Pydantic request/response schemas
    crud.py          Data-access + business rules (progress/status sync, activity logging)
    routers/
      tasks.py
      dashboard.py
  init_db.py

frontend/
  src/
    api/            Axios client + endpoint wrappers
    context/         TaskContext (shared state, mutations, refetch)
    components/      layout, dashboard, tasks, kanban, common
    pages/            Dashboard, TaskList, TaskDetails, Kanban
    types/            Shared TypeScript types
    utils/            Date/deadline helpers, badge/color constants
```
