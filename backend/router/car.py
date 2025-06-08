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
        # Создаем запись в БД (если нужно)
        analyse_id = await CarRepository.create_analyse(analyse_data.vin)
        
        # Тестовые данные ГИБДД
        gibdd_data = {
            "gibdd": {
                "status": 200,
                "found": True,
                "utilicazia": 0,
                "utilicaziainfo": "",
                "vehicle": {
                    "vin": analyse_data.vin,  # Используем реальный VIN
                    "bodyNumber": "MOCKBODY123456",
                    "engineNumber": "MOCKENG1234",
                    "model": "MockCar 2025",
                    "color": "ЧЕРНЫЙ",
                    "year": "2025",
                    "engineVolume": "2000.0",
                    "category": "B",
                    "type": "21",
                    "typeinfo": "Легковой универсал",
                    "powerHp": "150.0",
                    "powerKwt": "110.3"
                },
                "vehiclePassport": {
                    "number": "MOCKPTS1234",
                    "issue": "МОК ТАМОЖНЯ"
                },
                "ownershipPeriod": [
                    {
                        "lastOperation": "03",
                        "lastOperationInfo": "Изменение собственника",
                        "simplePersonType": "Natural",
                        "simplePersonTypeInfo": "Физическое лицо",
                        "from": "01.01.2020",
                        "to": "01.01.2021",
                        "period": "1 год"
                    }
                ],
                "inquiry": {
                    "price": 0.8,
                    "balance": 9999.99,
                    "credit": "0.00",
                    "speed": 1,
                    "attempts": 1
                }
            },
            "restrict": {
                "status": 200,
                "found": True,
                "restrictions": [
                    {
                        "osn": "Запрет",
                        "ogrkod": "001",
                        "regname": "ГУ МВД",
                        "ogrdate": "01.05.2024"
                    }
                ]
            },
            "wanted": {
                "status": 200,
                "found": True,
                "records": [
                    {
                        "regname": "ГУ МВД",
                        "reason": "Хищение",
                        "date": "01.04.2023"
                    }
                ]
            },
            "dtp": {
                "status": 200,
                "found": True,
                "accidents": [
                    {
                        "date": "10.12.2022",
                        "region": "МОСКВА",
                        "type": "столкновение",
                        "damage": "задняя часть"
                    }
                ]
            },
            "fines": {
                "status": 200,
                "found": True,
                "fines": [
                    {
                        "article": "12.9 ч.2",
                        "date": "01.05.2024",
                        "number": "1888888888888",
                        "amount": 1500.0,
                        "status": "неоплачен"
                    }
                ],
                "totalAmount": 1500.0
            },
            "eaisto": {
                "status": 200,
                "found": True,
                "records": [
                    {
                        "date": "01.01.2024",
                        "result": "пройден",
                        "odometer": "123456",
                        "station": "СТО МОК"
                    }
                ]
            },
            "ownersCount": 1,
            "hasRestriction": True,
            "wantedCar": True,
            "hasAccidents": True,
            "hasFines": True,
            "finesAmount": 1500.0
        }
        
        return {
            "success": True,
            "analyse_id": analyse_id,
            "vin_check_data": {
                "brand": "MockCar",
                "model": "2025",
                "production_year": "2025",
                "color": "ЧЕРНЫЙ",
                "engine_volume": "2000.0",
                "engine_type": "Бензин",
                "transmission": "Автомат",
                "drive_type": "Полный",
                "steering_wheel": "Левый",
                "body_type": "Легковой универсал",
                "accidents_history": "10.12.2022 - столкновение (задняя часть)",
                "restrictions": "Запрет (ГУ МВД)",
                "wanted_info": "Хищение (ГУ МВД)",
                "last_technical_inspection": "01.01.2024 - пройден",
                "total_fines_amount": "1500.0"
            },
            "full_gibdd_data": gibdd_data  # Дополнительно возвращаем полные данные
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/change_params")
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