"""Standalone script to (re)create the InternSync database schema.

Run with: python init_db.py
"""
from app.database import Base, engine
from app import models  # noqa: F401  (ensures models are registered on Base.metadata)


def main() -> None:
    print(f"Creating tables on {engine.url} ...")
    Base.metadata.create_all(bind=engine)
    print("Done. Tables created:", list(Base.metadata.tables.keys()))


if __name__ == "__main__":
    main()
