from typing import List, Dict, Any
import uuid
import random

class MLStub:
    @staticmethod
    def analyze_images(images: List[bytes]) -> Dict[str, Any]:
        """Анализирует изображения и возвращает результат"""
        analysis_id = str(uuid.uuid4())
        
        # Генерируем случайные повреждения
        damages = []
        parts = ["Front bumper", "Left door", "Right door", "Hood", "Trunk"]
        types = ["scratch", "dent", "crack", "other"]
        severities = ["light", "moderate", "severe"]
        
        for _ in range(random.randint(1, 4)):
            damage = {
                "id": str(uuid.uuid4()),
                "part": random.choice(parts),
                "type": random.choice(types),
                "severity": random.choice(severities),
                "coordinates": {
                    "x": round(random.uniform(0, 0.9), 2),
                    "y": round(random.uniform(0, 0.9), 2),
                    "width": round(random.uniform(0.05, 0.3), 2),
                    "height": round(random.uniform(0.05, 0.3), 2)
                }
            }
            damages.append(damage)
        
        return {
            "analysisId": analysis_id,
            "damages": damages
        }

    @staticmethod
    def estimate_repair_cost(analysis_id: str, region: str) -> Dict[str, Any]:
        """Оценивает стоимость ремонта"""
        estimate_id = str(uuid.uuid4())
        
        # Генерируем случайные стоимости ремонта
        repairs = []
        works = ["Repainting", "Dent removal", "Part replacement", "Polishing"]
        
        for i in range(random.randint(1, 4)):
            repairs.append({
                "damageId": str(uuid.uuid4()),
                "part": f"Part {i+1}",
                "work": random.choice(works),
                "cost": random.randint(5000, 30000)
            })
        
        return {
            "estimateId": estimate_id,
            "region": region,
            "currency": "RUB",
            "repairs": repairs,
            "totalCost": sum(r["cost"] for r in repairs)
        }