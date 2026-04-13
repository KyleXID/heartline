"""이미지 전처리: OCR 정확도를 높이기 위한 OpenCV 처리."""

import cv2
import numpy as np


def preprocess_for_ocr(image_path: str) -> np.ndarray:
    """카카오톡 스크린샷을 OCR에 최적화된 이미지로 전처리."""
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError(f"이미지를 읽을 수 없습니다: {image_path}")

    # 그레이스케일 변환
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # 해상도가 낮으면 2배 확대
    h, w = gray.shape
    if w < 1000:
        gray = cv2.resize(gray, (w * 2, h * 2), interpolation=cv2.INTER_CUBIC)

    # 노이즈 제거
    denoised = cv2.fastNlMeansDenoising(gray, h=10)

    # 대비 향상 (CLAHE)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    enhanced = clahe.apply(denoised)

    return enhanced
