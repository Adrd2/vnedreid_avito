from fastapi import APIRouter, UploadFile, File, HTTPException, status, Form
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
            "body_type": "Внедорожник 5-дв.",
            "vin": vin
        }
        return {"success": True, "analyse_id": analyse_id, "vin_check_data": data}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("change_params")
async def update_analyse(analyse_id: int):
    try:
        data = {
            "brand": "Nissan",
            "model": "X-Trail 1.5 AT",
            "year": 2013,
            "transmission": "Ручная",
            "drive_type": "Передний",
            "color": "Белый",
            "wheel_side": "Левый",
            "engine_volume": 0.5,
            "engine_type": "Гибрид",
            "body_type": "Внедорожник 5-дв."
        }
        return data
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/upload")
async def upload_photos(
    analyse_id: int, 
    photos: List[UploadFile] = File(...),
    positions: List[str] = Form(...)
):
    try:
        # Проверяем соответствие количества фото и позиций
        print(positions)
        sep_positions = positions[0]
        print(sep_positions)
        sep_positions = [pos.strip() for pos in sep_positions.split(',')]
        print(sep_positions)
        if len(photos) != len(sep_positions):
            raise ValueError("Количество фотографий и позиций должно совпадать")
        
        # Собираем данные с уникальными именами файлов
        images_data = []
        for i, (photo, sep_positions) in enumerate(zip(photos, sep_positions), start=1):
            image_data = await photo.read()
            filename = f"{i}_{sep_positions}.jpg"  # Уникальное имя файла
            images_data.append((image_data, sep_positions, filename))
        
        result = await CarRepository.upload_images(analyse_id, images_data)
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