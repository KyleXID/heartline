package io.heumlabs.heartline.service.ocr;

import static org.bytedeco.opencv.global.opencv_imgcodecs.imread;
import static org.bytedeco.opencv.global.opencv_imgproc.COLOR_BGR2GRAY;
import static org.bytedeco.opencv.global.opencv_imgproc.INTER_CUBIC;
import static org.bytedeco.opencv.global.opencv_imgproc.createCLAHE;
import static org.bytedeco.opencv.global.opencv_imgproc.cvtColor;
import static org.bytedeco.opencv.global.opencv_imgproc.resize;
import static org.bytedeco.opencv.global.opencv_photo.fastNlMeansDenoising;

import org.bytedeco.opencv.opencv_core.Mat;
import org.bytedeco.opencv.opencv_core.Size;
import org.bytedeco.opencv.opencv_imgproc.CLAHE;
import org.springframework.stereotype.Component;

/**
 * 이미지 전처리: OCR 정확도를 높이기 위한 OpenCV 처리. services/ocr/preprocess.py 대응.
 * <p>EasyOCR 기준으로 튜닝된 전처리이므로 Tesseract 정확도는 별도 재검증이 필요하다.
 */
@Component
public class ImagePreprocessor {

    /**
     * 카카오톡 스크린샷을 OCR 에 최적화된 이미지(Mat)로 전처리.
     * <p>반환된 Mat 은 네이티브 메모리를 점유하므로 호출 측에서 {@code close()} 해야 한다.
     * 내부 중간 Mat 은 단계별로 즉시 해제한다.
     */
    public Mat preprocessForOcr(String imagePath) {
        Mat img = imread(imagePath);
        if (img.empty()) {
            img.close();
            throw new IllegalArgumentException("이미지를 읽을 수 없습니다: " + imagePath);
        }

        // 그레이스케일 변환
        Mat gray = new Mat();
        cvtColor(img, gray, COLOR_BGR2GRAY);
        img.close();

        // 해상도가 낮으면 2배 확대
        int width = gray.cols();
        int height = gray.rows();
        if (width < 1000) {
            Mat resized = new Mat();
            resize(gray, resized, new Size(width * 2, height * 2), 0, 0, INTER_CUBIC);
            gray.close();
            gray = resized;
        }

        // 노이즈 제거 (h=10, 나머지는 OpenCV 기본값)
        Mat denoised = new Mat();
        fastNlMeansDenoising(gray, denoised, 10.0f, 7, 21);
        gray.close();

        // 대비 향상 (CLAHE)
        CLAHE clahe = createCLAHE(2.0, new Size(8, 8));
        Mat enhanced = new Mat();
        clahe.apply(denoised, enhanced);
        denoised.close();
        clahe.close();

        return enhanced;
    }
}
