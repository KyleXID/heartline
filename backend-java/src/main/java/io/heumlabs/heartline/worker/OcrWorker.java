package io.heumlabs.heartline.worker;

import io.heumlabs.heartline.domain.ConversationImage;
import io.heumlabs.heartline.service.ocr.OcrPipeline;
import io.heumlabs.heartline.service.ocr.dto.OcrResult;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

/**
 * 비동기 OCR 워커. worker.py(ARQ process_ocr) + core/queue.py(enqueue_ocr) 대응.
 * <p>ARQ 의 별도 워커 프로세스를 Spring {@code @Async} 스레드로 단순 포팅했다.
 * 다중 인스턴스/대규모 처리가 필요하면 메시지큐(RabbitMQ/SQS/Redis Streams)로 확장한다.
 */
@Component
public class OcrWorker {

    private static final Logger log = LoggerFactory.getLogger(OcrWorker.class);

    private final OcrProcessingService processingService;
    private final OcrPipeline ocrPipeline;

    public OcrWorker(OcrProcessingService processingService, OcrPipeline ocrPipeline) {
        this.processingService = processingService;
        this.ocrPipeline = ocrPipeline;
    }

    /** 대화 이미지들에 OCR→파싱→저장을 수행. 호출자의 트랜잭션 커밋 이후 별도 스레드에서 실행된다. */
    @Async("ocrTaskExecutor")
    public void processOcr(UUID conversationId, String myNickname) {
        try {
            processingService.markProcessing(conversationId);

            List<ConversationImage> images = processingService.imagesInOrder(conversationId);
            List<String> paths = images.stream()
                    .map(ConversationImage::getImageFile)
                    .filter(Objects::nonNull)
                    .toList();

            List<OcrResult> results = ocrPipeline.runOcrPipeline(paths);
            processingService.saveOcrResults(conversationId, myNickname, results);

            log.info("ocr_done conversationId={} images={}", conversationId, results.size());
        } catch (Exception e) {
            log.error("ocr_worker_failed conversationId={}", conversationId, e);
        }
    }
}
