from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy import ForeignKey, Integer, String, DateTime, Enum
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from enum import Enum as PyEnum
from database import Model




# =============================================
# Перечисления (вы можете расширить эти списки)
# =============================================


class CarPartType(str, PyEnum):
    WINDSHIELD = "Windshield"  # Лобовое стекло
    BACK_WINDSHIELD = "Back-windshield"  # Заднее стекло
    
    # Окна
    FRONT_WINDOW_LEFT = "Left-Front-window"  # Переднее окно (левое)
    FRONT_WINDOW_RIGHT = "Right-Front-window"  # Переднее окно (правое)
    BACK_WINDOW_LEFT = "Left-Back-window"  # Заднее окно (левое)
    BACK_WINDOW_RIGHT = "Right-Back-window"  # Заднее окно (правое)
    
    # Двери
    FRONT_DOOR_LEFT = "Left-Front-door"  # Передняя дверь (левая)
    FRONT_DOOR_RIGHT = "Right-Front-door"  # Передняя дверь (правая)
    BACK_DOOR_LEFT = "Left-Back-door"  # Задняя дверь (левая)
    BACK_DOOR_RIGHT = "Right-Back-door"  # Задняя дверь (правая)
    
    # Колеса
    FRONT_WHEEL_LEFT = "Left-Front-wheel"  # Переднее колесо (левое)
    FRONT_WHEEL_RIGHT = "Right-Front-wheel"  # Переднее колесо (правое)
    BACK_WHEEL_LEFT = "Left-Back-wheel"  # Заднее колесо (левое)
    BACK_WHEEL_RIGHT = "Right-Back-wheel"  # Заднее колесо (правое)
    
    # Бамперы
    FRONT_BUMPER = "Front-bumper"  # Передний бампер
    BACK_BUMPER = "Back-bumper"  # Задний бампер
    
    # Освещение
    HEADLIGHT_LEFT = "Left-Headlight"  # Фара (левая)
    HEADLIGHT_RIGHT = "Right-Headlight"  # Фара (правая)
    TAIL_LIGHT_LEFT = "Left-Tail-light"  # Задний фонарь (левый)
    TAIL_LIGHT_RIGHT = "Right-Tail-light"  # Задний фонарь (правый)
    
    HOOD = "Hood"  # Капот
    TRUNK = "Trunk"  # Багажник
    LICENSE_PLATE = "License-plate"  # Номерной знак
    MIRROR = "Mirror"  # Зеркало
    ROOF = "Roof"  # Крыша
    GRILLE = "Grille"  # Решётка радиатора
    
    # Панели
    ROCKER_PANEL_LEFT = "Left-Rocker-panel"  # Порог автомобиля (левый)
    ROCKER_PANEL_RIGHT = "Right-Rocker-panel"  # Порог автомобиля (правый)
    QUARTER_PANEL_LEFT = "Left-Quarter-panel"  # Боковая панель кузова (левая)
    QUARTER_PANEL_RIGHT = "Right-Quarter-panel"  # Боковая панель кузова (правая)
    FENDER_LEFT = "Left-Fender"  # Крыло (левое)
    FENDER_RIGHT = "Right-Fender"  # Крыло (правое)


class DefectType(str, PyEnum):
    DENT = "Dent"  # Вмятина
    CRACKED = "Cracked"  # Трещина
    SCRATCH = "Scratch"  # Царапина
    FLAKING = "Flaking"  # Отслаивание (краски/покрытия)
    BROKEN_PART = "Broken part"  # Сломанная деталь
    PAINT_CHIP = "Paint chip"  # Скол краски
    MISSING_PART = "Missing part"  # Отсутствующая деталь
    CORROSION = "Corrosion"  # Коррозия


class SeverityLevel(int, PyEnum):
    NONE = 0       # Нет повреждений
    LOW = 1        # Незначительные повреждения
    MEDIUM = 2     # Средние повреждения
    HIGH = 3       # Серьезные повреждения
    CRITICAL = 4   # Критические повреждения


# =============================================
# Основные модели
# =============================================


class CarAnalysisOrm(Model):
    __tablename__ = 'car_analyses'
    
    id: Mapped[int] = mapped_column(primary_key=True)
    vin: Mapped[Optional[str]] = mapped_column(nullable=True)
    result_quality: Mapped[int] = mapped_column(nullable=True)  # 0-5
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    
    # Связи
    parts: Mapped[List['CarPartAnalysisOrm']] = relationship(back_populates="analysis")


class CarPartAnalysisOrm(Model):
    __tablename__ = 'car_part_analyses'
    
    id: Mapped[int] = mapped_column(primary_key=True)
    analysis_id: Mapped[int] = mapped_column(ForeignKey('car_analyses.id'))
    part_type: Mapped[CarPartType] = mapped_column(Enum(CarPartType))
    quality: Mapped[int] = mapped_column(Integer)  # 0-5
    
    # Связи
    analysis: Mapped['CarAnalysisOrm'] = relationship(back_populates="parts")
    defects: Mapped[List['PartDefectOrm']] = relationship(back_populates="part_analysis")


class PartDefectOrm(Model):
    __tablename__ = 'part_defects'
    
    id: Mapped[int] = mapped_column(primary_key=True)
    part_analysis_id: Mapped[int] = mapped_column(ForeignKey('car_part_analyses.id'))
    defect_type: Mapped[DefectType] = mapped_column(Enum(DefectType))
    severity: Mapped[SeverityLevel] = mapped_column(Enum(SeverityLevel))
    description: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    
    # Связи
    part_analysis: Mapped['CarPartAnalysisOrm'] = relationship(back_populates="defects")


class AnalysisMetadataOrm(Model):
    __tablename__ = 'analysis_metadata'
    
    id: Mapped[int] = mapped_column(primary_key=True)
    analysis_id: Mapped[int] = mapped_column(ForeignKey('car_analyses.id'))
    key: Mapped[str] = mapped_column(String(50))
    value: Mapped[str] = mapped_column(String(500))
    
    # Связи
    analysis: Mapped['CarAnalysisOrm'] = relationship()