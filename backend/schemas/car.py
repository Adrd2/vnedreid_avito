from pydantic import BaseModel, ConfigDict
from typing import Dict, List, Literal
from datetime import datetime




class SDefectDetail(BaseModel):
    defect_type: str
    severity: Literal["low", "medium", "high"]
    description: str

class SCarPartAnalysis(BaseModel):
    quality: int
    metadata: List[str] = []
    defects: List[str] = []
    detailed: List[SDefectDetail] = []

class SAnalyseResult(BaseModel):
    quality: int
    car_parts: Dict[str, SCarPartAnalysis]
    created_at: datetime

class SAnalyseResponse(BaseModel):
    success: bool
    details_analize: SAnalyseResult
    
class SCreateAnalyse(BaseModel):
    vin: str
