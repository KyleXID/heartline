package io.heumlabs.heartline.worker;

import io.heumlabs.heartline.domain.ConversationImage;
import io.heumlabs.heartline.domain.Message;
import io.heumlabs.heartline.repository.ConversationImageRepository;
import io.heumlabs.heartline.repository.ConversationRepository;
import io.heumlabs.heartline.repository.MessageRepository;
import io.heumlabs.heartline.service.ocr.dto.OcrResult;
import io.heumlabs.heartline.service.parser.KakaoMessageParser;
import io.heumlabs.heartline.service.parser.dto.ParsedMessage;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * OCR 워커의 DB 트랜잭션 단위 작업. worker.py(process_ocr) 대응 + 파싱·저장 연결 보강.
 * <p>OCR 자체(무거운 작업)는 {@link OcrWorker} 가 트랜잭션 밖에서 수행하고,
 * 여기서는 짧은 트랜잭션으로 상태 전이와 결과 저장만 담당한다.
 */
@Service
public class OcrProcessingService {

    private final ConversationRepository conversationRepository;
    private final ConversationImageRepository imageRepository;
    private final MessageRepository messageRepository;
    private final KakaoMessageParser parser;

    public OcrProcessingService(ConversationRepository conversationRepository,
            ConversationImageRepository imageRepository, MessageRepository messageRepository,
            KakaoMessageParser parser) {
        this.conversationRepository = conversationRepository;
        this.imageRepository = imageRepository;
        this.messageRepository = messageRepository;
        this.parser = parser;
    }

    @Transactional
    public void markProcessing(UUID conversationId) {
        conversationRepository.findById(conversationId)
                .ifPresent(c -> c.setStatus("processing"));
    }

    @Transactional(readOnly = true)
    public List<ConversationImage> imagesInOrder(UUID conversationId) {
        return imageRepository.findByConversationIdOrderByOrderAsc(conversationId);
    }

    /**
     * OCR 결과를 이미지별 ocr_text 로 저장하고, 합친 텍스트를 파싱해 Message 로 저장한 뒤
     * 상태를 ocr_complete 로 전이한다.
     */
    @Transactional
    public void saveOcrResults(UUID conversationId, String myNickname, List<OcrResult> results) {
        List<ConversationImage> images = imageRepository.findByConversationIdOrderByOrderAsc(conversationId);
        for (ConversationImage img : images) {
            results.stream()
                    .filter(r -> r.imagePath().equals(img.getImageFile()))
                    .findFirst()
                    .ifPresent(r -> img.setOcrText(r.ocrText()));
        }

        // Python 에 누락돼 있던 OCR→파싱→Message 저장 연결 (save_parsed_messages 대응)
        String combined = results.stream().map(OcrResult::ocrText).collect(Collectors.joining("\n"));
        List<ParsedMessage> parsed = parser.parseOcrText(combined, myNickname);
        for (ParsedMessage pm : parsed) {
            messageRepository.save(Message.builder()
                    .conversation(conversationRepository.getReferenceById(conversationId))
                    .senderType(pm.senderType())
                    .content(pm.content())
                    .sentAt(pm.sentAt())
                    .build());
        }

        conversationRepository.findById(conversationId)
                .ifPresent(c -> c.setStatus("ocr_complete"));
    }
}
