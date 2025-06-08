import os
import httpx
import datetime
from database import new_session
from models.car import CarAnalysisOrm, CarPartAnalysisOrm, PartDefectOrm, AnalysisMetadataOrm
from sqlalchemy import select
from schemas.car import SAnalyseResult
from fastapi import HTTPException
from typing import List, Dict
from pathlib import Path
import asyncio




DAMAGE_WEIGHTS = {
        "Dent": 1.5,
        "Cracked": 1.8,
        "Scratch": 0.5,
        "Flaking": 0.6,
        "Broken part": 2.0,
        "Paint chip": 0.6,
        "Missing part": 2.5,
        "Corrosion": 1.2
    }

# Коэффициенты важности по частям автомобиля
PART_WEIGHTS = {
    "Windshield": 1.5,
    "Back-windshield": 1.2,
    "Front-window": 0.6,
    "Back-window": 0.6,
    "Front-door": 1.3,
    "Back-door": 1.2,
    "Front-wheel": 1.0,
    "Back-wheel": 1.0,
    "Front-bumper": 1.0,
    "Back-bumper": 1.0,
    "Headlight": 1.1,
    "Tail-light": 1.0,
    "Hood": 1.2,
    "Trunk": 1.0,
    "License-plate": 0.3,
    "Mirror": 0.4,
    "Roof": 0.8,
    "Grille": 0.7,
    "Rocker-panel": 1.0,
    "Quarter-panel": 1.2,
    "Fender": 1.1
}

MAX_DAMAGE_SCORE = 12  # Максимально возможный ущерб


class CarRepository:
    UPLOAD_DIR = "uploads"
    NEURAL_API_URL = "http://localhost:4070/api/v1/find_defects"
    #GIBDD_API_URL = "http://localhost:8085/api/vin/{vin}"
    GIBDD_API_URL = "http://localhost:8085/api/vin/mock/1"
    
        # Коэффициенты серьезности по типам повреждений
    
    @classmethod
    async def _get_test_defects(cls):
        """Возвращает тестовые данные, если нейросеть недоступна"""
        return {
            "report": [
                {
                    "car_part": "Front-door",
                    "confidence": 0.89,
                    "defect_type": "Dent",
                    "severity": 4.5
                },
                {
                    "car_part": "Front-bumper",
                    "confidence": 0.76,
                    "defect_type": "Scratch",
                    "severity": 0.1
                }
            ],
            "total_defects": 2,
            "processing_time_ms": 1250.5
        }
        
    
    @classmethod
    async def _send_to_neural(cls, image_path: str) -> Dict:
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                # Читаем файл в бинарном режиме
                with open(image_path, "rb") as file:
                    files = {
                        "file": (os.path.basename(image_path), file, "image/jpeg")
                    }
                    
                    # Добавляем логирование для отладки
                    print(f"Sending file to neural: {image_path}")
                    
                    response = await client.post(
                        cls.NEURAL_API_URL,
                        files=files,
                        headers={"Accept": "application/json"}
                    )
                    
                    # Логируем ответ
                    print(f"Neural API response status: {response.status_code}")
                    
                    response.raise_for_status()
                    return response.json()
                    
        except httpx.ConnectError as e:
            print(f"Connection error to neural API: {str(e)}")
            raise HTTPException(
                status_code=502,
                detail="Невозможно подключиться к сервису анализа изображений"
            )
        except httpx.ReadTimeout as e:
            print(f"Timeout error: {str(e)}")
            raise HTTPException(
                status_code=504,
                detail="Таймаут при обработке изображения"
            )
        except Exception as e:
            print(f"Unexpected error: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Ошибка при анализе изображения: {str(e)}"
            )
    
    @classmethod
    def _ensure_upload_dir_exists(cls):
        os.makedirs(cls.UPLOAD_DIR, exist_ok=True)
    
    
    @classmethod
    async def create_analyse(cls, vin: str) -> int:
        async with new_session() as session:
            # Просто создаем запись анализа без запроса к ГИБДД
            analyse = CarAnalysisOrm(vin=vin)
            session.add(analyse)
            await session.flush()
            await session.commit()
            return analyse.id
    
    
    @classmethod
    async def _get_gibdd_data(cls, vin: str) -> dict:
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                # Используем тестовый эндпоинт независимо от VIN
                response = await client.get(cls.GIBDD_API_URL)
                response.raise_for_status()
                data = response.json()
                
                # Подменяем VIN в ответе на реальный, если нужно
                if data.get("gibdd", {}).get("vehicle"):
                    data["gibdd"]["vehicle"]["vin"] = "1"
                    data["gibdd"]["vehicle"]["bodyNumber"] = "1"
                
                return data
        except Exception as e:
            raise HTTPException(
                status_code=502,
                detail=f"Ошибка при запросе тестовых данных ГИБДД: {str(e)}"
            )
    
    
    @classmethod
    async def _save_gibdd_metadata(cls, session, analyse_id: int, gibdd_data: dict):
        # Основные данные автомобиля
        if gibdd_data.get("gibdd", {}).get("vehicle"):
            vehicle = gibdd_data["gibdd"]["vehicle"]
            metadata = [
                ("brand", vehicle.get("model", "").split()[0]),
                ("model", vehicle.get("model", "")),
                ("year", vehicle.get("year", "")),
                ("color", vehicle.get("color", "")),
                ("engine_volume", vehicle.get("engineVolume", "")),
                ("power_hp", vehicle.get("powerHp", "")),
                ("category", vehicle.get("category", "")),
                ("body_type", vehicle.get("typeinfo", "")),
                ("transmission", "Автомат"),  # Тестовые данные
                ("drive_type", "Полный"),     # Тестовые данные
                ("steering_wheel", "Левый")   # Тестовые данные
            ]
            
            for key, value in metadata:
                session.add(AnalysisMetadataOrm(
                    analysis_id=analyse_id,
                    key=key,
                    value=str(value)
                ))
        
        # История ДТП
        if gibdd_data.get("dtp", {}).get("accidents"):
            accidents = [
                f"{acc['date']} - {acc['type']} ({acc['damage']})"
                for acc in gibdd_data["dtp"]["accidents"]
            ]
            session.add(AnalysisMetadataOrm(
                analysis_id=analyse_id,
                key="accidents_history",
                value="; ".join(accidents)
            ))
        
        # Штрафы
        if gibdd_data.get("fines", {}).get("fines"):
            total_fines = gibdd_data["fines"].get("totalAmount", 0)
            session.add(AnalysisMetadataOrm(
                analysis_id=analyse_id,
                key="total_fines_amount",
                value=str(total_fines)
            ))
        
        # Ограничения
        if gibdd_data.get("restrict", {}).get("restrictions"):
            restrictions = [
                f"{res['osn']} ({res['regname']})"
                for res in gibdd_data["restrict"]["restrictions"]
            ]
            session.add(AnalysisMetadataOrm(
                analysis_id=analyse_id,
                key="restrictions",
                value="; ".join(restrictions)
            ))
        
        # Розыск
        if gibdd_data.get("wanted", {}).get("records"):
            wanted = [
                f"{rec['reason']} ({rec['regname']})"
                for rec in gibdd_data["wanted"]["records"]
            ]
            session.add(AnalysisMetadataOrm(
                analysis_id=analyse_id,
                key="wanted_info",
                value="; ".join(wanted)
            ))
        
        # Техосмотр
        if gibdd_data.get("eaisto", {}).get("records"):
            last_to = gibdd_data["eaisto"]["records"][0]  # Берем первую запись
            session.add(AnalysisMetadataOrm(
                analysis_id=analyse_id,
                key="last_technical_inspection",
                value=f"{last_to['date']} - {last_to['result']}"
            ))
    
    
    @classmethod
    async def upload_images(cls, analyse_id: int, images_data: list[tuple[bytes, str, str]]) -> bool:
        try:
            cls._ensure_upload_dir_exists()
            analyse_dir = os.path.join(cls.UPLOAD_DIR, str(analyse_id))
            os.makedirs(analyse_dir, exist_ok=True)

            for image_data, position, filename in images_data:
                position_dir = os.path.join(analyse_dir, position)
                os.makedirs(position_dir, exist_ok=True)
                
                file_path = os.path.join(position_dir, filename)
                
                # Проверяем расширение файла
                if not filename.lower().endswith(('.jpg', '.jpeg', '.png')):
                    raise ValueError(f"Неподдерживаемый формат файла: {filename}")
                    
                # Сохраняем файл с проверкой
                try:
                    with open(file_path, "wb") as f:
                        f.write(image_data)
                except IOError as e:
                    raise ValueError(f"Ошибка сохранения файла {filename}: {str(e)}")

            return True
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Ошибка при загрузке изображений: {str(e)}"
            )
    
    
    @classmethod
    async def analyse(cls, analyse_id: int) -> SAnalyseResult:
        try:
            async with httpx.AsyncClient() as client:
                healthcheck = await client.get(
                    "http://localhost:4070/api/v1/healthcheck",
                    timeout=5.0
                )
                if healthcheck.status_code != 200:
                    raise HTTPException(
                        status_code=503,
                        detail="Сервис анализа изображений недоступен"
                    )
        except Exception as e:
            raise HTTPException(
                status_code=503,
                detail=f"Не удалось проверить статус сервиса анализа: {str(e)}"
            )
        async with new_session() as session:
            # Получаем анализ из БД
            query = select(CarAnalysisOrm).where(CarAnalysisOrm.id == analyse_id)
            result = await session.execute(query)
            analyse = result.scalars().first()
            
            if not analyse:
                raise ValueError("Analysis not found")

            # Получаем все загруженные изображения
            analyse_dir = os.path.join(cls.UPLOAD_DIR, str(analyse_id))
            if not os.path.exists(analyse_dir):
                raise ValueError("No images uploaded for this analysis")

            car_parts = {}
            total_damage_score = 0.0
            processed_images = 0

            for position in os.listdir(analyse_dir):
                position_dir = os.path.join(analyse_dir, position)
                if os.path.isdir(position_dir):
                    for image_file in os.listdir(position_dir):
                        image_path = os.path.join(position_dir, image_file)
                        
                        # Отправляем изображение в нейросеть
                        #neural_response = await cls._send_to_neural(image_path)
                        neural_response = await cls._get_test_defects()
                        
                        # Обрабатываем каждый дефект
                        for defect in neural_response.get("report", []):
                            part_type = defect["car_part"]
                            defect_type = defect["defect_type"]
                            severity = defect["severity"] / 5  # Нормализуем severity (0-1)
                            confidence = defect["confidence"]
                            
                            # Получаем коэффициенты
                            damage_weight = DAMAGE_WEIGHTS.get(defect_type, 1.0)
                            part_weight = PART_WEIGHTS.get(part_type, 1.0)
                            
                            # Рассчитываем ущербность дефекта
                            # Используем severity как площадь повреждения (поскольку нет точных данных)
                            damage_score = damage_weight * part_weight * severity * confidence
                            total_damage_score += damage_score
                            
                            # Сохраняем данные по детали
                            if part_type not in car_parts:
                                car_parts[part_type] = {
                                    "quality": 5.0,
                                    "metadata": [],
                                    "defects": [],
                                    "detailed": [],
                                    "total_damage": 0.0
                                }
                            
                            defect_detail = {
                                "defect_type": defect_type,
                                "severity": min(4, max(0, round(defect["severity"]))),
                                "description": f"Confidence: {confidence:.2f}",
                                "damage_score": damage_score,
                                "confidence": confidence
                            }
                            
                            car_parts[part_type]["detailed"].append(defect_detail)
                            car_parts[part_type]["defects"].append(defect_type)
                            car_parts[part_type]["total_damage"] += damage_score
                        
                        processed_images += 1

            # Рассчитываем финальную оценку состояния (0-4)
            condition_score = max(0.0, 4 - 4 * (total_damage_score / MAX_DAMAGE_SCORE))
            condition_score = round(condition_score, 2)
            
            # Рассчитываем качество для каждой детали
            for part_data in car_parts.values():
                # Нормализуем ущерб детали (0-1)
                normalized_damage = min(1.0, part_data["total_damage"] / (MAX_DAMAGE_SCORE / len(car_parts)))
                # Переводим в качество (0-5)
                part_data["quality"] = max(0.0, 5 - 5 * normalized_damage)
                part_data["quality"] = round(part_data["quality"], 1)
                
                # TODO: Можно добавить расчет стоимости ремонта для каждой детали
                # repair_cost = part_data["total_damage"] * COST_FACTOR.get(part_type, 1.0)
                # part_data["repair_cost_estimate"] = repair_cost

            # Сохраняем результаты в БД
            await cls._save_analysis_results(session, analyse_id, car_parts, condition_score)
            
            return SAnalyseResult(
                quality=condition_score,
                car_parts=car_parts,
                created_at=analyse.created_at,
                total_damage_score=total_damage_score  # Можно добавить в схему
            )
    
    
    @classmethod
    async def _save_analysis_results(cls, session, analyse_id: int, car_parts: Dict, total_quality: float):
        # Обновляем основной анализ
        query = select(CarAnalysisOrm).where(CarAnalysisOrm.id == analyse_id)
        result = await session.execute(query)
        analyse = result.scalars().first()
        analyse.result_quality = total_quality
        
        # Сохраняем данные по деталям
        for part_type, part_data in car_parts.items():
            part_analysis = CarPartAnalysisOrm(
                analysis_id=analyse_id,
                part_type=part_type,
                quality=part_data["quality"]
            )
            session.add(part_analysis)
            await session.flush()
            
            # Сохраняем дефекты
            for defect in part_data["detailed"]:
                defect_orm = PartDefectOrm(
                    part_analysis_id=part_analysis.id,
                    defect_type=defect["defect_type"],
                    severity=defect["severity"],
                    description=defect["description"]
                )
                session.add(defect_orm)
        
        await session.commit()