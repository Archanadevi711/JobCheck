from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

import models, schemas, crud
from database import engine, get_db

# Create table schema
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="JobCheck API", description="AI Platform for detecting fraudulent job listings")

# CORS config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for local MVP
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the JobCheck API"}

@app.post("/api/scan", response_model=schemas.ScanResponse)
def scan_listing(listing: schemas.ListingCreate, db: Session = Depends(get_db)):
    db_listing, db_pred = crud.create_listing_and_predict(db=db, listing=listing)
    
    # Refresh to safely serialize
    db.refresh(db_listing)
    return {"listing": db_listing, "prediction": db_pred}

@app.get("/api/history", response_model=List[schemas.Listing])
def read_history(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    listings = crud.get_history(db, skip=skip, limit=limit)
    return listings

@app.get("/api/listings/{listing_id}", response_model=schemas.Listing)
def read_listing(listing_id: int, db: Session = Depends(get_db)):
    db_listing = crud.get_listing(db, listing_id=listing_id)
    if db_listing is None:
        raise HTTPException(status_code=404, detail="Listing not found")
    return db_listing
