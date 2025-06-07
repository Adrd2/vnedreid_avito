"""
Model loading and management service
"""
import torch
import logging
from typing import Optional, Any
from detectron2.engine import DefaultPredictor
from detectron2.config import get_cfg
from detectron2 import model_zoo
from src.config.settings import settings

logger = logging.getLogger(__name__)

class ModelManager:
    """Manages loading and initialization of ML models"""
    
    def __init__(self):
        self.parts_predictor: Optional[DefaultPredictor] = None
        self.damage_predictor: Optional[DefaultPredictor] = None
        self.severity_model: Optional[Any] = None
        self.models_loaded: bool = False
        
    def _load_detectron2_model(
        self, 
        model_path: str, 
        threshold: float, 
        num_classes: int,
        model_name: str = "Unknown"
    ) -> DefaultPredictor:
        """Load a Detectron2 model with given configuration"""
        try:
            logger.info(f"Loading {model_name} model from {model_path}")
            
            cfg = get_cfg()
            cfg.merge_from_file(model_zoo.get_config_file(settings.DETECTRON2_CONFIG_FILE))
            cfg.MODEL.ROI_HEADS.SCORE_THRESH_TEST = threshold
            cfg.MODEL.ROI_HEADS.NUM_CLASSES = num_classes
            cfg.MODEL.WEIGHTS = model_path
            
            # Set device
            if torch.cuda.is_available() and settings.DEVICE == "cuda":
                cfg.MODEL.DEVICE = 'cuda'
                logger.info(f"Using CUDA for {model_name} model")
            else:
                cfg.MODEL.DEVICE = 'cpu'
                logger.info(f"Using CPU for {model_name} model")
                
            predictor = DefaultPredictor(cfg)
            logger.info(f"Successfully loaded {model_name} model")
            return predictor
            
        except Exception as e:
            logger.error(f"Failed to load {model_name} model: {str(e)}")
            raise
    
    def load_models(self) -> bool:
        """Load all required models"""
        try:
            logger.info("Starting model loading process...")
            
            # Load parts detection model
            self.parts_predictor = self._load_detectron2_model(
                model_path=settings.PARTS_MODEL_PATH,
                threshold=settings.PARTS_MODEL_THRESHOLD,
                num_classes=settings.PARTS_MODEL_NUM_CLASSES,
                model_name="Parts Detection"
            )
            
            # Load damage detection model
            self.damage_predictor = self._load_detectron2_model(
                model_path=settings.DAMAGE_MODEL_PATH,
                threshold=settings.DAMAGE_MODEL_THRESHOLD,
                num_classes=settings.DAMAGE_MODEL_NUM_CLASSES,
                model_name="Damage Detection"
            )
            
            # Load severity model (placeholder)
            # TODO: Implement severity model loading when available
            self.severity_model = None
            
            self.models_loaded = True
            logger.info("All models loaded successfully")
            return True
            
        except Exception as e:
            logger.error(f"Failed to load models: {str(e)}")
            self.models_loaded = False
            return False
    
    def get_parts_predictor(self) -> DefaultPredictor:
        """Get the parts detection predictor"""
        if not self.parts_predictor:
            raise RuntimeError("Parts detection model not loaded")
        return self.parts_predictor
    
    def get_damage_predictor(self) -> DefaultPredictor:
        """Get the damage detection predictor"""
        if not self.damage_predictor:
            raise RuntimeError("Damage detection model not loaded")
        return self.damage_predictor
    
    def get_severity_model(self) -> Optional[Any]:
        """Get the severity assessment model"""
        if not self.severity_model:
            raise RuntimeError("Severity assessment model not loaded")
        return self.severity_model
    
    def is_ready(self) -> bool:
        """Check if all models are loaded and ready"""
        # return self.models_loaded and self.parts_predictor is not None and self.damage_predictor is not None and self.severity_model is not None
        return self.models_loaded and self.parts_predictor is not None and self.damage_predictor is not None

# Global model manager instance
model_manager = ModelManager()
