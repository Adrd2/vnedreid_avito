from fastapi import APIRouter, UploadFile, File, HTTPException, status, Form
from repositories.car import CarRepository
from typing import List
from schemas.car import SAnalyseResponse, SCreateAnalyse
from models.car import AnalysisMetadataOrm
from database import new_session
from sqlalchemy import select




router = APIRouter(
    prefix="/api",
    tags=['AutoCheck AI']
)



@router.post("/create_analyse")
async def create_analyse(analyse_data: SCreateAnalyse):
    try:
        analyse_id = await CarRepository.create_analyse(analyse_data.vin)
        
        # Получаем данные для ответа клиенту
        async with new_session() as session:
            query = select(AnalysisMetadataOrm).where(
                AnalysisMetadataOrm.analysis_id == analyse_id
            )
            result = await session.execute(query)
            metadata = {item.key: item.value for item in result.scalars()}
            
            # Формируем ответ в том же формате, что и раньше
            response_data = {
                "brand": metadata.get("brand", "Неизвестно"),
                "model": metadata.get("model", "Неизвестно"),
                "production_year": metadata.get("year", "Неизвестно"),
                "color": metadata.get("color", "Неизвестно"),
                "engine_volume": metadata.get("engine_volume", "Неизвестно"),
                "engine_type": "Неизвестно",  # Можно добавить в метаданные
                "transmission": "Неизвестно",  # Можно добавить в метаданные
                "drive_type": "Неизвестно",   # Можно добавить в метаданные
                "steering_wheel": "Неизвестно", # Можно добавить в метаданные
                "body_type": metadata.get("body_type", "Неизвестно"),
                "accidents_history": metadata.get("accidents_history", "Нет данных"),
                "restrictions": metadata.get("restrictions", "Нет ограничений"),
                "last_technical_inspection": metadata.get("last_technical_inspection", "Нет данных"),
                "total_fines_amount": metadata.get("total_fines_amount", "0")
            }
            
        return {
            "success": True,
            "analyse_id": analyse_id,
            "vin_check_data": response_data
        }
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