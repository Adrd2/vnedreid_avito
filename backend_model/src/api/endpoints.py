"""
API endpoints for car defects detection
"""
import time
import logging
from datetime import datetime
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from src.models.schemas import DefectDetectionResponse, HealthCheckResponse, ErrorResponse
from src.services.detection_service import detection_service
from src.services.model_service import model_manager
from src.utils.image_utils import ImageProcessor
from src.config.settings import settings

logger = logging.getLogger(__name__)

router = APIRouter()

async def get_image_processor():
    """Dependency to get image processor"""
    return ImageProcessor()

@router.post(
    "/find_defects",
    response_model=DefectDetectionResponse,
    responses={
        400: {"model": ErrorResponse, "description": "Bad Request - Invalid image"},
        413: {"model": ErrorResponse, "description": "Payload Too Large"},
        500: {"model": ErrorResponse, "description": "Internal Server Error"},
    },
    summary="Detect car defects in uploaded image",
    description="""
    Upload a car image to detect defects such as dents, scratches, cracks, etc.
    
    The API will:
    1. Detect car parts in the image
    2. Identify various types of damage/defects
    3. Match defects to specific car parts
    4. Assess severity of each defect
    5. Return a comprehensive report
    
    **Supported image formats:** JPG, JPEG, PNG, BMP, TIFF
    **Maximum file size:** 10MB
    """,
    tags=["Detection"]
)
async def find_defects(
    file: UploadFile = File(..., description="Car image file to analyze"),
    image_processor: ImageProcessor = Depends(get_image_processor)
) -> DefectDetectionResponse:
    """
    Detect defects in uploaded car image
    
    Args:
        file: Uploaded image file
        image_processor: Image processing utility
        
    Returns:
        DefectDetectionResponse with detected defects
    """
    start_time = time.time()
    
    try:
        logger.info(f"Processing defect detection request for file: {file.filename}")
        
        if not model_manager.is_ready():
            raise HTTPException(
                status_code=500,
                detail="Models are not loaded. Please check server status."
            )
        
        image = image_processor.validate_and_load_image(file)
        
        defects = detection_service.detect_defects(image)
        
        processing_time_ms = (time.time() - start_time) * 1000
        
        response = DefectDetectionResponse(
            report=defects,
            total_defects=len(defects),
            processing_time_ms=round(processing_time_ms, 2)
        )
        
        logger.info(f"Defect detection completed. Found {len(defects)} defects in {processing_time_ms:.2f}ms")
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error during defect detection: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )

@router.get(
    "/healthcheck",
    response_model=HealthCheckResponse,
    summary="Health check endpoint",
    description="""
    Check the health status of the API service.
    
    Returns information about:
    - Service status
    - API version
    - Model loading status
    - GPU availability
    - Current timestamp
    """,
    tags=["Health"]
)
async def healthcheck() -> HealthCheckResponse:
    """
    Health check endpoint
    
    Returns:
        HealthCheckResponse with service status
    """
    try:
        import torch
        gpu_available = torch.cuda.is_available()
        
        return HealthCheckResponse(
            status="healthy",
            timestamp=datetime.utcnow().isoformat() + "Z",
            version=settings.VERSION,
            models_loaded=model_manager.is_ready(),
            gpu_available=gpu_available
        )
        
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return HealthCheckResponse(
            status="unhealthy",
            timestamp=datetime.utcnow().isoformat() + "Z",
            version=settings.VERSION,
            models_loaded=False,
            gpu_available=False
        )
