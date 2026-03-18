import time
import random

def predict_fraud_risk(text: str) -> dict:
    """
    Mock Deep Learning prediction logic.
    In a real app, this would load a Scikit-learn/PyTorch/Transformers model and run inference.
    """
    # Simple keyword-based mock heuristics
    text_lower = text.lower()
    
    red_flags = []
    base_risk = 15.0
    
    keywords = {
        "wire transfer": 40.0,
        "western union": 35.0,
        "whatsapp": 20.0,
        "paypal": 15.0,
        "money order": 30.0,
        "gift card": 45.0,
        "urgent hire": 10.0,
        "work from home": 5.0,
        "no experience necessary": 10.0,
        "unlimited earning": 15.0,
        "investment required": 50.0
    }
    
    for word, risk in keywords.items():
        if word in text_lower:
            base_risk += risk
            red_flags.append(word.title())
    
    # Introduce some randomness for variety
    risk_score = min(max(base_risk + random.uniform(-5, 15), 0), 99.9)
    
    if risk_score > 70:
        risk_level = "High"
    elif risk_score > 35:
        risk_level = "Medium"
    else:
        risk_level = "Low"
        
    return {
        "risk_score": round(risk_score, 1),
        "risk_level": risk_level,
        "red_flags": red_flags[:5] # keep top 5
    }
