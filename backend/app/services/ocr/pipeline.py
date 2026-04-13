"""EasyOCR 기반 OCR 파이프라인."""

import easyocr
import numpy as np

from app.services.ocr.preprocess import preprocess_for_ocr

# EasyOCR reader를 모듈 레벨에서 lazy 초기화 (모델 로딩이 무거움)
_reader: easyocr.Reader | None = None


def _get_reader() -> easyocr.Reader:
    global _reader
    if _reader is None:
        _reader = easyocr.Reader(["ko", "en"], gpu=False)
    return _reader


def run_ocr_on_image(image_path: str) -> str:
    """단일 이미지에 대해 OCR 수행, 텍스트 반환."""
    preprocessed = preprocess_for_ocr(image_path)
    reader = _get_reader()
    results = reader.readtext(preprocessed, detail=0, paragraph=True)
    return "\n".join(results)


def run_ocr_pipeline(image_paths: list[str]) -> list[dict]:
    """여러 이미지에 대해 순서대로 OCR 수행.

    Returns:
        [{"image_path": str, "ocr_text": str}, ...]
    """
    outputs = []
    for path in image_paths:
        try:
            text = run_ocr_on_image(path)
        except Exception as e:
            text = f"[OCR 실패: {e}]"
        outputs.append({"image_path": path, "ocr_text": text})
    return outputs
