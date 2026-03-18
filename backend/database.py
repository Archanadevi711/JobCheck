from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# We'll use SQLite for local development. 
# You can replace this with a PostgreSQL URL if you have it running:
# SQLALCHEMY_DATABASE_URL = "postgresql://user:password@localhost/jobcheck"
SQLALCHEMY_DATABASE_URL = "sqlite:///./jobcheck.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency for FastAPI endpoints
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
