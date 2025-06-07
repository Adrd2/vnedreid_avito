from database import new_session
from models.car import CarAnalysisOrm, CarDamageOrm
from sqlalchemy import select
from ml_stub import MLStub

class CarRepository:
    @classmethod
    async def analyze_images(cls, images: list) -> dict:
        # Получаем анализ от ML заглушки
        analysis_result = MLStub.analyze_images(images)
        
        # Сохраняем результат в БД
        async with new_session() as session:
            analysis = CarAnalysisOrm(id=analysis_result["analysisId"])
            session.add(analysis)
            
            for damage in analysis_result["damages"]:
                coords = damage["coordinates"]
                session.add(CarDamageOrm(
                    id=damage["id"],
                    analysis_id=analysis_result["analysisId"],
                    part=damage["part"],
                    type=damage["type"],
                    severity=damage["severity"],
                    x=coords["x"],
                    y=coords["y"],
                    width=coords["width"],
                    height=coords["height"]
                ))
            
            await session.commit()
        
        return analysis_result

    @classmethod
    async def get_repair_cost(cls, analysis_id: str, region: str) -> dict:
        # Получаем оценку стоимости от ML заглушки
        return MLStub.estimate_repair_cost(analysis_id, region)