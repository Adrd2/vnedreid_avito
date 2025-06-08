from pydantic import BaseModel, ConfigDict
from typing import Dict, List, Literal
from datetime import datetime




class SDefectDetail(BaseModel):
    defect_type: str
    severity: Literal[0, 1, 2, 3, 4]
    description: str
    damage_score: float | None = None
    confidence: float | None = None

class SCarPartAnalysis(BaseModel):
    quality: float
    metadata: List[str] = []
    defects: List[str] = []
    detailed: List[SDefectDetail] = []
    total_damage: float | None = None
    repair_cost_estimate: float | None = None

class SAnalyseResult(BaseModel):
    quality: float
    car_parts: Dict[str, SCarPartAnalysis]
    created_at: datetime
    total_damage_score: float | None = None

class SAnalyseResponse(BaseModel):
    success: bool
    details_analize: SAnalyseResult
    
class SCreateAnalyse(BaseModel):
    vin: str

class SVinCheckData(BaseModel):
    brand: str
    model: str
    production_year: str
    color: str
    engine_volume: str
    engine_type: str = "Неизвестно"
    transmission: str
    drive_type: str
    steering_wheel: str
    body_type: str
    accidents_history: str
    restrictions: str
    wanted_info: str
    last_technical_inspection: str
    total_fines_amount: str
    
class SCreateAnalyseResponse(BaseModel):
    success: bool
    analyse_id: int
    vin_check_data: SVinCheckData