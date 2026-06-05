from fastapi import FastAPI
from pydantic import BaseModel
import random

app = FastAPI(title="VoltTrack ML Predictor")

class BatteryPredictRequest(BaseModel):
    vehicleId: int
    currentBattery: float
    usagePattern: str
    ageMonths: int

class MaintenancePredictRequest(BaseModel):
    telemetry: list

@app.post("/predict/battery")
def predict_battery_life(request: BatteryPredictRequest):
    # Dummy ML approximation: Older batteries drop to 20% faster.
    # Linear projection: Assumes 1% drop every 12 hours initially.
    base_degrad_rate = 0.5 # % per day
    age_factor = 1 + (request.ageMonths * 0.05)
    
    daily_drop = base_degrad_rate * age_factor
    if request.currentBattery <= 20:
        days_to_critical = 0
    else:
        days_to_critical = (request.currentBattery - 20) / daily_drop
        
    return {
        "vehicleId": request.vehicleId,
        "daysToCritical20Percent": round(days_to_critical, 1)
    }

@app.post("/predict/maintenance")
def predict_maintenance(request: MaintenancePredictRequest):
    # Analyze array of telemetry to produce a heuristic risk score.
    # For now, generate a random score to simulate RandomForest probability output.
    risk_score = random.randint(10, 85)
    recommendation = "Schedule Routine Checkup"
    if risk_score > 75:
        recommendation = "Immediate Battery Module Inspection Required"
    elif risk_score > 50:
        recommendation = "Review Thermal Management System"
        
    return {
        "riskScore": risk_score,
        "recommendation": recommendation
    }
