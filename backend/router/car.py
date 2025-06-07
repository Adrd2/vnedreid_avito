from fastapi import APIRouter, UploadFile, File, HTTPException, status
from schemas.car import (
    AnalysisResponse, RepairCostEstimateResponse,
    RepairCostEstimateRequest, Error
)
from repositories.car import CarRepository
from typing import List

router = APIRouter(
    prefix="/api",
    tags=['AutoCheck AI']
)

@router.post(
    "/analyze",
    response_model=AnalysisResponse,
    responses={
        400: {"model": Error},
    }
)
async def analyze_damage(photos: List[UploadFile] = File(...)):
    if not photos:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"code": "no_photos", "message": "No photos provided"}
        )
    
    try:
        # Читаем содержимое фотографий (но не сохраняем их)
        images = [await photo.read() for photo in photos]
        result = await CarRepository.analyze_images(images)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"code": "analysis_failed", "message": str(e)}
        )

@router.post(
    "/repairs",
    response_model=RepairCostEstimateResponse,
    responses={
        400: {"model": Error},
    }
)
async def get_repair_cost(data: RepairCostEstimateRequest):
    try:
        result = await CarRepository.get_repair_cost(data.analysisId, data.region)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"code": "estimate_failed", "message": str(e)}
        )