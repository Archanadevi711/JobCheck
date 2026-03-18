from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, JSON, DateTime
from sqlalchemy.orm import relationship
import datetime
from database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    listings = relationship("Listing", back_populates="owner")

class Listing(Base):
    __tablename__ = "listings"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    company = Column(String, index=True)
    location = Column(String)
    description = Column(Text)
    requirements = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    owner = relationship("User", back_populates="listings")
    prediction = relationship("Prediction", back_populates="listing", uselist=False)

class Prediction(Base):
    __tablename__ = "predictions"
    
    id = Column(Integer, primary_key=True, index=True)
    listing_id = Column(Integer, ForeignKey("listings.id"))
    risk_score = Column(Float)            # 0.0 to 100.0
    risk_level = Column(String)           # 'Low', 'Medium', 'High'
    red_flags = Column(JSON)              # List of strings e.g. ["Too good to be true", "Grammar errors"]
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    listing = relationship("Listing", back_populates="prediction")
