from pydantic import BaseModel, ConfigDict
from typing import List
from enum import Enum

class DamageType(str, Enum):
    SCRATCH = "scratch"
    DENT = "dent"
    CRACK = "crack"
    OTHER = "other"

class DamageSeverity(str, Enum):
    LIGHT = "light"
    MODERATE = "moderate"
    SEVERE = "severe"

class Coordinates(BaseModel):
    x: float
    y: float
    width: float
    height: float

class Damage(BaseModel):
    id: str
    part: str
    type: DamageType
    severity: DamageSeverity
    coordinates: Coordinates

class AnalysisResponse(BaseModel):
    analysisId: str
    damages: List[Damage]

class RepairCostEstimateRequest(BaseModel):
    analysisId: str
    region: str

class RepairItem(BaseModel):
    damageId: str
    part: str
    work: str
    cost: float

class RepairCostEstimateResponse(BaseModel):
    estimateId: str
    region: str
    currency: str = "RUB"
    repairs: List[RepairItem]
    totalCost: float

class Error(BaseModel):
    code: str
    message: str
    coordinates: str | None = None
    model_config = ConfigDict(from_attributes=True)