package io.heumlabs.heartline.service.ocr;

import io.heumlabs.heartline.config.OcrProperties;
import io.heumlabs.heartline.service.ocr.dto.OcrResult;
import java.awt.image.BufferedImage;
import java.util.ArrayList;
import java.util.List;
import net.sourceforge.tess4j.Tesseract;
import org.bytedeco.javacv.Java2DFrameConverter;
import org.bytedeco.javacv.OpenCVFrameConverter;
import org.bytedeco.opencv.opencv_core.Mat;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * Tesseract(Tess4J) 기반 OCR 파이프라인. services/ocr/pipeline.py 대응.
 * <p>원본의 EasyOCR reader 는 모듈 레벨 lazy 싱글턴이었으나, {@link Tesseract} 는
 * thread-safe 하지 않아 호출 스레드마다 인스턴스를 생성한다.
 */
@Component
public class OcrPipeline {

    private static final Logger log = LoggerFactory.getLogger(OcrPipeline.class);

    private final ImagePreprocessor preprocessor;
    private final OcrProperties properties;

    public OcrPipeline(ImagePreprocessor preprocessor, OcrProperties properties) {
        this.preprocessor = preprocessor;
        this.properties = properties;
    }

    private Tesseract newTesseract() {
        Tesseract tesseract = new Tesseract();
        if (properties.tessdataPath() != null && !properties.tessdataPath().isBlank()) {
            tesseract.setDatapath(properties.tessdataPath());
        }
        tesseract.setLanguage(properties.language());
        return tesseract;
    }

    /** 단일 이미지에 대해 OCR 수행, 텍스트 반환. */
    public String runOcrOnImage(String imagePath) throws Exception {
        Mat preprocessed = preprocessor.preprocessForOcr(imagePath);
        try {
            BufferedImage image = toBufferedImage(preprocessed);
            return newTesseract().doOCR(image).strip();
        } finally {
            preprocessed.close();
        }
    }

    /** 여러 이미지에 대해 순서대로 OCR 수행. */
    public List<OcrResult> runOcrPipeline(List<String> imagePaths) {
        List<OcrResult> outputs = new ArrayList<>();
        for (String path : imagePaths) {
            String text;
            try {
                text = runOcrOnImage(path);
            } catch (Exception e) {
                text = "[OCR 실패: " + e.getMessage() + "]";
                log.warn("ocr_failed path={}", path, e);
            }
            outputs.add(new OcrResult(path, text));
        }
        return outputs;
    }

    private BufferedImage toBufferedImage(Mat mat) {
        OpenCVFrameConverter.ToMat matConverter = new OpenCVFrameConverter.ToMat();
        Java2DFrameConverter frameConverter = new Java2DFrameConverter();
        BufferedImage converted = frameConverter.convert(matConverter.convert(mat));
        if (converted == null) {
            throw new IllegalStateException("Mat -> BufferedImage 변환 실패: 지원하지 않는 이미지 포맷");
        }
        // converter 가 내부 버퍼를 재사용하므로 안전하게 복사본을 반환.
        return Java2DFrameConverter.cloneBufferedImage(converted);
    }
}
