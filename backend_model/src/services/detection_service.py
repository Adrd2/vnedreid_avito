"""
Car defects detection service
"""
import numpy as np
import logging
import time
from typing import List, Tuple
from PIL import Image
from src.config.settings import settings
from src.services.model_service import model_manager
from src.models.schemas import DefectDetection

logger = logging.getLogger(__name__)

class DefectDetectionService:
    """Service for detecting car defects using computer vision models"""
    
    def __init__(self):
        self.id_to_part_name = {v: k for k, v in settings.PART_CATEGORIES.items()}
    
    def compute_iou(self, boxA: List[float], boxB: List[float]) -> float:
        """Calculate Intersection over Union (IoU) between two bounding boxes"""
        xA = max(boxA[0], boxB[0])
        yA = max(boxA[1], boxB[1])
        xB = min(boxA[2], boxB[2])
        yB = min(boxA[3], boxB[3])
        
        interArea = max(0, xB - xA + 1) * max(0, yB - yA + 1)
        boxAArea = (boxA[2] - boxA[0] + 1) * (boxA[3] - boxA[1] + 1)
        boxBArea = (boxB[2] - boxB[0] + 1) * (boxB[3] - boxB[1] + 1)
        
        iou = interArea / float(boxAArea + boxBArea - interArea)
        return iou
    
    def _match_damage_to_parts(
        self, 
        damage_detections: List[Tuple[float, List[float], str]], 
        part_detections: List[Tuple[float, List[float], str]]
    ) -> List[Tuple[str, str, float]]:
        """
        Match detected damages to car parts based on bounding box overlap
        Returns list of (defect_type, car_part, confidence) tuples
        """
        matched_defects = []
        
        for damage_score, damage_box, damage_type in damage_detections:
            best_match_part = "Unknown"
            best_iou = 0.0
            
            for part_score, part_box, part_type in part_detections:
                iou = self.compute_iou(damage_box, part_box)
                if iou > best_iou and iou > 0.1:
                    best_iou = iou
                    best_match_part = part_type
            
            if best_iou > 0.1:  # Only consider matches with significant overlap
                matched_defects.append((damage_type, best_match_part, damage_score))
        
        return matched_defects
    
    def detect_defects(self, image: Image.Image) -> List[DefectDetection]:
        """
        Detect defects in a car image
        
        Args:
            image: PIL Image object
            
        Returns:
            List of DefectDetection objects
        """
        start_time = time.time()
        
        try:
            image_array = np.array(image)
            
            parts_predictor = model_manager.get_parts_predictor()
            damage_predictor = model_manager.get_damage_predictor()
            # severity_model = model_manager.get_severity_model()
            
            logger.info("Running parts detection...")
            parts_predictions = parts_predictor(image_array)
            
            logger.info("Running damage detection...")
            damage_predictions = damage_predictor(image_array)

            # logger.info("Running severity assessment...")
            # severity_predictions = severity_model(image_array)
            
            parts_detections = []
            if len(parts_predictions['instances']) > 0:
                parts_scores = parts_predictions['instances'].scores.cpu().numpy()
                parts_boxes = parts_predictions['instances'].pred_boxes.tensor.cpu().numpy()
                parts_classes = parts_predictions['instances'].pred_classes.cpu().numpy()
                
                for score, box, class_id in zip(parts_scores, parts_boxes, parts_classes):
                    if score > settings.PARTS_MODEL_THRESHOLD:
                        part_name = self.id_to_part_name.get(class_id, f"Unknown_Part_{class_id}")
                        parts_detections.append((score, box.tolist(), part_name))
            
            damage_detections = []
            if len(damage_predictions['instances']) > 0:
                damage_scores = damage_predictions['instances'].scores.cpu().numpy()
                damage_boxes = damage_predictions['instances'].pred_boxes.tensor.cpu().numpy()
                damage_classes = damage_predictions['instances'].pred_classes.cpu().numpy()
                
                for score, box, class_id in zip(damage_scores, damage_boxes, damage_classes):
                    if score > settings.DAMAGE_MODEL_THRESHOLD:
                        damage_type = settings.DAMAGE_CATEGORIES.get(class_id, f"Unknown_Damage_{class_id}")
                        damage_detections.append((score, box.tolist(), damage_type))
            
            matched_defects = self._match_damage_to_parts(damage_detections, parts_detections)
            
            defect_results = []
            for defect_type, car_part, confidence in matched_defects:
                defect_results.append(DefectDetection(
                    defect_type=defect_type,
                    car_part=car_part,
                    severity=5.0,
                    confidence=confidence
                ))
            
            processing_time = (time.time() - start_time) * 1000
            logger.info(f"Defect detection completed in {processing_time:.2f}ms. Found {len(defect_results)} defects.")
            
            return defect_results
            
        except Exception as e:
            logger.error(f"Error during defect detection: {str(e)}")
            raise

detection_service = DefectDetectionService()
