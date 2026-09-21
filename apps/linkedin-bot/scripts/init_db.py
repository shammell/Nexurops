#!/usr/bin/env python3
"""Initialize LinkedIn Content Assistant database and directories."""

import sqlite3
import os
import sys
from pathlib import Path

def init_database():
    """Initialize SQLite database with schema."""
    db_path = Path(__file__).parent.parent / "data" / "linkedin.db"
    schema_path = Path(__file__).parent.parent / "database" / "schema.sql"

    try:
        # Connect to database
        conn = sqlite3.connect(str(db_path))
        cursor = conn.cursor()

        # Read and execute schema
        with open(schema_path, 'r') as f:
            schema = f.read()

        cursor.executescript(schema)
        conn.commit()
        conn.close()

        print(f"✅ Database initialized: {db_path}")
        return True
    except Exception as e:
        print(f"❌ Database initialization failed: {e}")
        return False

def create_directories():
    """Create necessary directories."""
    base_path = Path(__file__).parent.parent

    dirs = [
        base_path / "data" / "memory",
        base_path / "data" / "exports",
        base_path / "logs",
    ]

    for dir_path in dirs:
        dir_path.mkdir(parents=True, exist_ok=True)
        print(f"✅ Directory ready: {dir_path}")

def create_memory_logs():
    """Create initial memory log files."""
    base_path = Path(__file__).parent.parent

    memory_files = [
        base_path / "data" / "memory" / "content_performance.md",
        base_path / "data" / "memory" / "dm_outcomes.md",
    ]

    for file_path in memory_files:
        if not file_path.exists():
            file_path.write_text(f"# Memory Log: {file_path.stem}\n\nLast updated: [TBD]\n\n")
            print(f"✅ Memory log created: {file_path}")
        else:
            print(f"⚠️  Memory log already exists: {file_path}")

def check_env():
    """Check if .env exists."""
    base_path = Path(__file__).parent.parent
    env_path = base_path / ".env"
    env_example_path = base_path / ".env.example"

    if not env_path.exists():
        print(f"\n⚠️  .env file not found!")
        print(f"   Copy .env.example to .env and fill in your API keys:")
        print(f"   cp {env_example_path} {env_path}")
        return False
    else:
        print(f"✅ .env file exists: {env_path}")
        return True

def main():
    """Run initialization."""
    print("🚀 LinkedIn Content Assistant - Database Initialization\n")

    # Create directories
    create_directories()

    # Create memory logs
    create_memory_logs()

    # Initialize database
    if not init_database():
        sys.exit(1)

    # Check .env
    if not check_env():
        print("\n📋 NEXT STEPS:")
        print("1. Copy .env.example to .env")
        print("2. Fill in your LinkedIn and API credentials")
        print("3. Run: python scripts/authenticate.py")
        sys.exit(1)

    print("\n✅ All systems ready!")
    print("\n📋 NEXT STEPS:")
    print("1. Fill out config/voice.md with your brand voice")
    print("2. Run: python scripts/authenticate.py")

if __name__ == "__main__":
    main()
