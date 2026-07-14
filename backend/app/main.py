"""TeamSync FastAPI application entry point."""
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routers import tasks, dashboard

app = FastAPI(
    title="TeamSync API",
    description="Backend API for the TeamSync Team Task Tracker",
    version="1.0.0",
)

# Comma-separated list of allowed origins, e.g. "https://internsync.vercel.app,http://localhost:5173"
_default_origins = "http://localhost:5173,http://127.0.0.1:5173"
allowed_origins = [
    origin.strip()
    for origin in os.getenv("ALLOWED_ORIGINS", _default_origins).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    Base.metadata.create_all(bind=engine)


@app.get("/api/health", tags=["health"])
def health_check():
    return {"status": "ok"}


app.include_router(tasks.router)
app.include_router(dashboard.router)
