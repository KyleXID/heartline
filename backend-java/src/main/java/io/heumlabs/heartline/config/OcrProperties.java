package io.heumlabs.heartline.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/** config.py 의 OCR 설정 대응 (EasyOCR -> Tesseract). */
@ConfigurationProperties(prefix = "heartline.ocr")
public record OcrProperties(
        String tessdataPath,
        String language
) {
}
