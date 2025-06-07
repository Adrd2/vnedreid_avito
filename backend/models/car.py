from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from database import Model

class CarAnalysisOrm(Model):
    __tablename__ = 'car_analyses'
    
    id: Mapped[str] = mapped_column(primary_key=True)

class CarDamageOrm(Model):
    __tablename__ = 'car_damages'
    
    id: Mapped[str] = mapped_column(primary_key=True)
    analysis_id: Mapped[str] = mapped_column(ForeignKey('car_analyses.id'))
    part: Mapped[str]
    type: Mapped[str]  # scratch, dent, crack, other
    severity: Mapped[str]  # light, moderate, severe
    x: Mapped[float]
    y: Mapped[float]
    width: Mapped[float]
    height: Mapped[float]