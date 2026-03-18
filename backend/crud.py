from sqlalchemy.orm import Session
import models, schemas
from ml_mock import predict_fraud_risk

def create_listing_and_predict(db: Session, listing: schemas.ListingCreate):
    # 1. Create listing
    db_listing = models.Listing(
        title=listing.title,
        company=listing.company,
        location=listing.location,
        description=listing.description,
        requirements=listing.requirements
    )
    db.add(db_listing)
    db.commit()
    db.refresh(db_listing)
    
    # 2. Run mock ML prediction
    full_text = f"{listing.title or ''} {listing.description or ''} {listing.requirements or ''}"
    prediction_result = predict_fraud_risk(full_text)
    
    # 3. Save prediction
    db_pred = models.Prediction(
        listing_id=db_listing.id,
        risk_score=prediction_result["risk_score"],
        risk_level=prediction_result["risk_level"],
        red_flags=prediction_result["red_flags"]
    )
    db.add(db_pred)
    db.commit()
    db.refresh(db_pred)
    
    return db_listing, db_pred

def get_history(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Listing).order_by(models.Listing.created_at.desc()).offset(skip).limit(limit).all()

def get_listing(db: Session, listing_id: int):
    return db.query(models.Listing).filter(models.Listing.id == listing_id).first()
