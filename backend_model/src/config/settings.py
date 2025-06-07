"""
Configuration settings for the Car Defects Detection API
"""
import os
from typing import Dict

class Settings:
    # API Configuration
    APP_NAME: str = "Car Defects Detection API"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = "API for detecting car defects using computer vision models"
    
    # Server Configuration
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", 4070))
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"
    
    # Model Paths
    PARTS_MODEL_PATH: str = os.getenv("PARTS_MODEL_PATH", "https://huggingface.co/rarayayan/Detectron2-Zoo-Car-Parts-Detection/resolve/main/model_final.pth")
    DAMAGE_MODEL_PATH: str = os.getenv("DAMAGE_MODEL_PATH", "https://huggingface.co/rarayayan/Detectron2-Zoo-Car-Damage-Detection/resolve/main/model_final.pth")
    SEVERITY_MODEL_PATH: str = os.getenv("SEVERITY_MODEL_PATH", "")
    
    # Model Configuration
    PARTS_MODEL_THRESHOLD: float = 0.25
    DAMAGE_MODEL_THRESHOLD: float = 0.45
    PARTS_MODEL_NUM_CLASSES: int = 21
    DAMAGE_MODEL_NUM_CLASSES: int = 8
    
    # Device Configuration
    DEVICE: str = "cuda" if os.getenv("FORCE_CPU", "false").lower() != "true" else "cpu"
    
    # File Upload Configuration
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_EXTENSIONS: set = {".jpg", ".jpeg", ".png", ".bmp", ".tiff"}
    
    # Detectron2 Configuration
    DETECTRON2_CONFIG_FILE: str = "COCO-InstanceSegmentation/mask_rcnn_R_50_FPN_3x.yaml"
    
    # Part Category Mapping
    PART_CATEGORIES: Dict[str, int] = {
        "Windshield": 0,
        "Back-windshield": 1,
        "Front-window": 2,
        "Back-window": 3,
        "Front-door": 4,
        "Back-door": 5,
        "Front-wheel": 6,
        "Cracked": 7,
        "Front-bumper": 8,
        "Back-bumper": 9,
        "Headlight": 10,
        "Tail-light": 11,
        "Hood": 12,
        "Trunk": 13,
        "License-plate": 14,
        "Mirror": 15,
        "Roof": 16,
        "Grille": 17,
        "Rocker-panel": 18,
        "Quarter-panel": 19,
        "Fender": 20
    }
    
    # Damage Category Mapping
    DAMAGE_CATEGORIES: Dict[int, str] = {
        0: 'Dent',
        1: 'Cracked',
        2: 'Scratch',
        3: 'Flaking',
        4: 'Broken part',
        5: 'Paint chip',
        6: 'Missing part',
        7: 'Corrosion'
    }

settings = Settings()
