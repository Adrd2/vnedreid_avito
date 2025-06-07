from fastapi import APIRouter, UploadFile, File, HTTPException, status
from repositories.car import CarRepository
from typing import List
from schemas.car import SAnalyseResponse, SCreateAnalyse




router = APIRouter(
    prefix="/api",
    tags=['AutoCheck AI']
)



@router.post("/create_analyse")
async def create_analyse(analyse_data: SCreateAnalyse):
    try:
        analyse_id = await CarRepository.create_analyse(analyse_data.vin)
        data = {
            "brand": "Nissan",
            "model": "X-Trail 1.5 AT",
            "production_year": "2024г.",
            "transmission": "Автомат",
            "drive_type": "Полный",
            "color": "Белый",
            "steering_wheel": "Левый",
            "engine_volume": "1.5 л",
            "engine_type": "Гибрид",
            "body_type": "Внедорожник 5-дв."
        }
        return {"success": True, "analyse_id": analyse_id, "vin_check_data": data}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/upload")
async def upload_photos(analyse_id: int, position: str, photos: List[UploadFile] = File(...)):
    try:
        images = [await photo.read() for photo in photos]
        result = await CarRepository.upload_images(analyse_id, position, images) #Возвращает bool
        return {"success": True, "message": "Фотографии загружены"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/analyse", response_model=SAnalyseResponse)
async def get_analyse(analyse_id: int):
    try:
        result = await CarRepository.analyse(analyse_id)
        return {
            "success": True,
            "details_analize": result
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))