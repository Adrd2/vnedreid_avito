import os
import httpx
from database import new_session
from models.car import CarAnalysisOrm, CarPartAnalysisOrm, PartDefectOrm
from sqlalchemy import select
from schemas.car import SAnalyseResult
from fastapi import HTTPException
from typing import List, Dict
from pathlib import Path
import asyncio




class CarRepository:
    UPLOAD_DIR = "uploads"
    NEURAL_API_URL = "http://localhost:4070/api/v1/find_defects"
    
    @classmethod
    async def _send_to_neural(cls, image_path: str) -> Dict:
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                with open(image_path, "rb") as file:
                    files = {"file": (Path(image_path).name, file, "image/jpeg")}
                    response = await client.post(cls.NEURAL_API_URL, files=files)
                    response.raise_for_status()
                    return response.json()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Neural API error: {str(e)}")
    
    @classmethod
    def _ensure_upload_dir_exists(cls):
        os.makedirs(cls.UPLOAD_DIR, exist_ok=True)
    
    
    @classmethod
    async def create_analyse(cls, vin: str) -> int:
        async with new_session() as session:
            analyse = CarAnalysisOrm(vin=vin)
            session.add(analyse)
            await session.flush()
            await session.commit()
            
            query = select(CarAnalysisOrm)
            await session.execute(query)
            return analyse.id
    
    
    @classmethod
    async def upload_images(cls, analyse_id: int, images_data: list[tuple[bytes, str, str]]) -> bool:
        cls._ensure_upload_dir_exists()
        
        analyse_dir = os.path.join(cls.UPLOAD_DIR, str(analyse_id))
        os.makedirs(analyse_dir, exist_ok=True)
        
        for image_data, position, filename in images_data:
            # Создаем подпапку для позиции, если её нет
            position_dir = os.path.join(analyse_dir, position)
            os.makedirs(position_dir, exist_ok=True)
            
            # Сохраняем файл с уникальным именем
            file_path = os.path.join(position_dir, filename)
            with open(file_path, "wb") as f:
                f.write(image_data)
        
        return True
    
    
    @classmethod
    async def analyse(cls, analyse_id: int) -> SAnalyseResult:
        async with new_session() as session:
            # Получаем анализ из БД
            query = select(CarAnalysisOrm).where(CarAnalysisOrm.id == analyse_id)
            result = await session.execute(query)
            analyse = result.scalars().first()
            
            if not analyse:
                raise ValueError("Analysis not found")

            # Получаем все загруженные изображения для этого анализа
            analyse_dir = os.path.join(cls.UPLOAD_DIR, str(analyse_id))
            if not os.path.exists(analyse_dir):
                raise ValueError("No images uploaded for this analysis")

            car_parts = {}
            total_quality = 0
            processed_images = 0

            # Обрабатываем каждую загруженную фотографию
            for position in os.listdir(analyse_dir):
                position_dir = os.path.join(analyse_dir, position)
                if os.path.isdir(position_dir):
                    for image_file in os.listdir(position_dir):
                        image_path = os.path.join(position_dir, image_file)
                        
                        # Отправляем изображение в нейросеть
                        neural_response = await cls._send_to_neural(image_path)
                        
                        # Обрабатываем ответ нейросети
                        for defect in neural_response.get("report", []):
                            part_type = defect["car_part"]
                            if part_type not in car_parts:
                                car_parts[part_type] = {
                                    "quality": 5,  # Начальное качество (максимальное)
                                    "metadata": [],
                                    "defects": [],
                                    "detailed": []
                                }
                            
                            # Преобразуем severity из 0-5 в 0-4
                            severity = min(4, max(0, round(defect["severity"])))
                            
                            defect_detail = {
                                "defect_type": defect["defect_type"],
                                "severity": severity,
                                "description": f"Confidence: {defect['confidence']:.2f}"
                            }
                            
                            car_parts[part_type]["detailed"].append(defect_detail)
                            car_parts[part_type]["defects"].append(defect["defect_type"])
                            
                            # Рассчитываем качество детали (чем больше дефектов, тем хуже качество)
                            # TODO: Можно доработать эту логику
                            quality_reduction = severity * 0.5
                            car_parts[part_type]["quality"] = max(0, 
                                car_parts[part_type]["quality"] - quality_reduction)
                        
                        processed_images += 1

            # Рассчитываем общее качество автомобиля
            if car_parts:
                total_quality = sum(part["quality"] for part in car_parts.values()) / len(car_parts)
                total_quality = round(total_quality, 1)
            
            # TODO: Здесь можно добавить дополнительные расчеты:
            # - Общая стоимость ремонта
            # - Критические дефекты
            # - Рекомендации по ремонту
            
            # Сохраняем результаты в БД
            await cls._save_analysis_results(session, analyse_id, car_parts, total_quality)
            
            return SAnalyseResult(
                quality=total_quality,
                car_parts=car_parts,
                created_at=analyse.created_at
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