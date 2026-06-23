package io.heumlabs.heartline.service.ocr.dto;

/** run_ocr_pipeline 의 {"image_path", "ocr_text"} 대응. */
public record OcrResult(
        String imagePath,
        String ocrText
) {
}
