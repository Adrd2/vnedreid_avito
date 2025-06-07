"""
Utility functions for the API
"""
import io
import logging
from PIL import Image
from fastapi import UploadFile, HTTPException
from src.config.settings import settings

logger = logging.getLogger(__name__)

class ImageProcessor:
    """Utility class for image processing operations"""
    
    @staticmethod
    def validate_image_file(file: UploadFile) -> None:
        """
        Validate uploaded image file
        
        Args:
            file: FastAPI UploadFile object
            
        Raises:
            HTTPException: If file is invalid
        """
        if file.size and file.size > settings.MAX_FILE_SIZE:
            raise HTTPException(
                status_code=413,
                detail=f"File size exceeds maximum allowed size of {settings.MAX_FILE_SIZE // (1024*1024)}MB"
            )
        
        if file.filename:
            file_ext = '.' + file.filename.split('.')[-1].lower()
            if file_ext not in settings.ALLOWED_EXTENSIONS:
                raise HTTPException(
                    status_code=400,
                    detail=f"Unsupported file format. Allowed formats: {', '.join(settings.ALLOWED_EXTENSIONS)}"
                )
    
    @staticmethod
    def load_image_from_upload(file: UploadFile) -> Image.Image:
        """
        Load PIL Image from uploaded file
        
        Args:
            file: FastAPI UploadFile object
            
        Returns:
            PIL Image object
            
        Raises:
            HTTPException: If image cannot be loaded
        """
        try:
            contents = file.file.read()
            
            image = Image.open(io.BytesIO(contents))
            
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            logger.info(f"Successfully loaded image: {image.size} pixels, mode: {image.mode}")
            return image
            
        except Exception as e:
            logger.error(f"Failed to load image: {str(e)}")
            raise HTTPException(
                status_code=400,
                detail=f"Invalid image file: {str(e)}"
            )
        finally:
            file.file.seek(0)
    
    @staticmethod
    def validate_and_load_image(file: UploadFile) -> Image.Image:
        """
        Validate and load image from uploaded file
        
        Args:
            file: FastAPI UploadFile object
            
        Returns:
            PIL Image object
        """
        ImageProcessor.validate_image_file(file)
        return ImageProcessor.load_image_from_upload(file)

def setup_logging(level: str = "INFO") -> None:
    """
    Setup logging configuration
    
    Args:
        level: Logging level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
    """
    logging.basicConfig(
        level=getattr(logging, level.upper()),
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.StreamHandler(),
        ]
    )
    
    logging.getLogger("uvicorn").setLevel(logging.INFO)
    logging.getLogger("detectron2").setLevel(logging.WARNING)
