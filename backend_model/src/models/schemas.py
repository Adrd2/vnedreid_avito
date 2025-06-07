"""
Pydantic models for API request/response validation
"""
from typing import List, Optional
from pydantic import BaseModel, Field, field_validator

class DefectDetection(BaseModel):
    """Model for individual defect detection result"""
    defect_type: str = Field(..., description="Type of defect detected (e.g., Dent, Scratch, Cracked)")
    car_part: str = Field(..., description="Car part where defect is located")
    severity: float = Field(..., ge=0.0, le=5.0, description="Severity level of the defect")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Confidence score between 0 and 1")

    @field_validator('severity')
    def validate_severity(cls, v):
        if not 0.0 <= v <= 5.0:
            raise ValueError('Severity must be between 0 and 5')
        return round(v, 3)
    
    @field_validator('confidence')
    def validate_confidence(cls, v):
        if not 0.0 <= v <= 1.0:
            raise ValueError('Confidence must be between 0 and 1')
        return round(v, 3)

class DefectDetectionResponse(BaseModel):
    """Response model for defect detection endpoint"""
    report: List[DefectDetection] = Field(..., description="List of detected defects")
    total_defects: int = Field(..., description="Total number of defects detected")
    processing_time_ms: float = Field(..., description="Processing time in milliseconds")
    
    class Config:
        json_schema_extra = {
            "example": {
                "report": [
                    {
                        "defect_type": "Dent",
                        "car_part": "Front-door",
                        "severity": 4.5,
                        "confidence": 0.89
                    },
                    {
                        "defect_type": "Scratch",
                        "car_part": "Front-bumper",
                        "severity": 0.1,
                        "confidence": 0.76
                    }
                ],
                "total_defects": 2,
                "processing_time_ms": 1250.5
            }
        }

class HealthCheckResponse(BaseModel):
    """Response model for health check endpoint"""
    status: str = Field(..., description="Service status")
    timestamp: str = Field(..., description="Current timestamp")
    version: str = Field(..., description="API version")
    models_loaded: bool = Field(..., description="Whether models are loaded successfully")
    gpu_available: bool = Field(..., description="Whether GPU is available")
    
    class Config:
        json_schema_extra = {
            "example": {
                "status": "healthy",
                "timestamp": "2025-06-07T14:30:00Z",
                "version": "1.0.0",
                "models_loaded": True,
                "gpu_available": True
            }
        }

class ErrorResponse(BaseModel):
    """Response model for error cases"""
    error: str = Field(..., description="Error message")
    detail: Optional[str] = Field(None, description="Detailed error information")
    timestamp: str = Field(..., description="Error timestamp")
    
    class Config:
        json_schema_extra = {
            "example": {
                "error": "Invalid image format",
                "detail": "Supported formats are: jpg, jpeg, png, bmp, tiff",
                "timestamp": "2025-06-07T14:30:00Z"
            }
        }
