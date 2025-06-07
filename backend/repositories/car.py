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
        # Тестовые данные, соответствующие ожидаемому формату
        car_parts = {
            "additionalProp1": {
                "quality": 0,
                "metadata": [],
                "defects": [],
                "detailed": []
            },
            "additionalProp2": {
                "quality": 0,
                "metadata": [],
                "defects": [],
                "detailed": []
            },
            "additionalProp3": {
                "quality": 0,
                "metadata": [],
                "defects": [],
                "detailed": []
            }
        }
        
        async with new_session() as session:
            query = select(CarAnalysisOrm).where(CarAnalysisOrm.id == analyse_id)
            result = await session.execute(query)
            analyse = result.scalars().first()
            
            if not analyse:
                raise ValueError("Analysis not found")
            
            return SAnalyseResult(
                quality=0,  # 0-5
                car_parts=car_parts,
                created_at=analyse.created_at
            )