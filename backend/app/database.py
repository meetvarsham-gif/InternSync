"""Database engine, session factory, and declarative base for InternSync."""
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Defaults to a local SQLite file; override via DATABASE_URL env var to point
# at PostgreSQL (e.g. postgresql+psycopg2://user:pass@host:5432/internsync).
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./internsync.db")

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """FastAPI dependency that yields a scoped DB session and closes it after use."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
