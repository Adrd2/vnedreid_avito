from pydantic import BaseModel, ConfigDict
from typing import Dict, List, Literal
from datetime import datetime




class SDefectDetail(BaseModel):
    defect_type: str
    severity: Literal[0, 1, 2, 3, 4]
    description: str
    confidence: float | None = None  # Добавляем confidence из нейросети

class SCarPartAnalysis(BaseModel):
    quality: float  # Меняем на float для более точной оценки
    metadata: List[str] = []
    defects: List[str] = []
    detailed: List[SDefectDetail] = []
    repair_cost_estimate: float | None = None  # Можно добавить расчет стоимости ремонта

class SAnalyseResult(BaseModel):
    quality: int
    car_parts: Dict[str, SCarPartAnalysis]
    created_at: datetime

class SAnalyseResponse(BaseModel):
    success: bool
    details_analize: SAnalyseResult
    
class SCreateAnalyse(BaseModel):
    vin: str
