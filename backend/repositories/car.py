import os
from database import new_session
from models.car import CarAnalysisOrm
from sqlalchemy import select
from schemas.car import SAnalyseResult




class CarRepository:
    UPLOAD_DIR = "uploads"
    
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
    async def upload_images(cls, analyse_id: int, position: str, images: list) -> bool:
        cls._ensure_upload_dir_exists()
        
        analyse_dir = os.path.join(cls.UPLOAD_DIR, str(analyse_id), str(position))
        os.makedirs(analyse_dir, exist_ok=True)
        
        for i, image_data in enumerate(images, start=1):
            file_path = os.path.join(analyse_dir, f"{i}.jpg")  # или .png в зависимости от формата
            
            with open(file_path, "wb") as f:
                f.write(image_data)
        
        # Здесь можно добавить логику сохранения информации в БД, если нужно
        async with new_session() as session:
            # Например, обновить запись анализа или создать записи о файлах
            pass
            
        return True
    
    
    @classmethod
    async def analyse(cls, analyse_id: int) -> SAnalyseResult:
        # Заглушка с фиксированными тестовыми данными
        car_parts = {
            "windshield": {
                "quality": 4,
                "metadata": ["clean"],
                "defects": ["crack"],
                "detailed": [
                    {
                        "defect_type": "crack",
                        "severity": "medium",
                        "description": "Small crack in the lower left corner"
                    }
                ]
            },
            "hood": {
                "quality": 3,
                "metadata": ["repainted"],
                "defects": ["scratch", "dent"],
                "detailed": [
                    {
                        "defect_type": "scratch",
                        "severity": "low",
                        "description": "Surface scratch 10cm long"
                    },
                    {
                        "defect_type": "dent",
                        "severity": "medium",
                        "description": "Small dent near the edge"
                    }
                ]
            }
        }
        
        async with new_session() as session:
            query = select(CarAnalysisOrm).where(CarAnalysisOrm.id == analyse_id)
            result = await session.execute(query)
            analyse = result.scalars().first()
            
            if not analyse:
                raise ValueError("Analysis not found")
            
            return SAnalyseResult(
                quality=5, #0-5
                car_parts=car_parts,
                created_at=analyse.created_at
            )