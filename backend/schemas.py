from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# --- Pydantic Schemas ---

class ListingBase(BaseModel):
    title: Optional[str] = "Raw Input"
    company: Optional[str] = "Unknown"
    location: Optional[str] = None
    description: str
    requirements: Optional[str] = None

class ListingCreate(ListingBase):
    pass

class PredictionBase(BaseModel):
    risk_score: float
    risk_level: str
    red_flags: List[str]

class Prediction(PredictionBase):
    id: int
    listing_id: int
    created_at: datetime
    
    class Config:
        orm_mode = True
        from_attributes = True

class Listing(ListingBase):
    id: int
    created_at: datetime
    prediction: Optional[Prediction] = None
    
    class Config:
        orm_mode = True
        from_attributes = True

class ScanResponse(BaseModel):
    listing: Listing
    prediction: Prediction
