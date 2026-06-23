package io.heumlabs.heartline.conversation;

import io.heumlabs.heartline.common.exception.ApiException;
import io.heumlabs.heartline.conversation.dto.ConversationCreateRequest;
import io.heumlabs.heartline.conversation.dto.ConversationListItem;
import io.heumlabs.heartline.conversation.dto.ConversationResponse;
import io.heumlabs.heartline.conversation.dto.ImageUploadResponse;
import io.heumlabs.heartline.domain.Conversation;
import io.heumlabs.heartline.domain.ConversationImage;
import io.heumlabs.heartline.domain.User;
import io.heumlabs.heartline.worker.OcrWorker;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/** api/conversations/routes.py 의 라우터 대응. */
@RestController
@RequestMapping("/api/conversations")
public class ConversationController {

    private static final Set<String> ALLOWED_TYPES =
            Set.of("image/jpeg", "image/png", "image/webp", "image/heic");
    private static final long MAX_FILE_SIZE = 10L * 1024 * 1024; // 10MB
    private static final int MAX_FILES = 20;

    private final ConversationService conversationService;
    private final OcrWorker ocrWorker;

    public ConversationController(ConversationService conversationService, OcrWorker ocrWorker) {
        this.conversationService = conversationService;
        this.ocrWorker = ocrWorker;
    }

    @GetMapping
    public List<ConversationListItem> list(@AuthenticationPrincipal User user) {
        return conversationService.list(user);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ConversationResponse create(@AuthenticationPrincipal User user,
            @Valid @RequestBody ConversationCreateRequest request) {
        Conversation conv = conversationService.createConversation(user, request.targetId());
        return ConversationResponse.from(conv, List.of());
    }

    @PostMapping("/{conversationId}/images")
    public ImageUploadResponse uploadImages(@AuthenticationPrincipal User user,
            @PathVariable UUID conversationId,
            @RequestParam("files") List<MultipartFile> files) {
        Conversation conv = conversationService.getOwnedConversation(user, conversationId);

        if (files.size() > MAX_FILES) {
            throw new ApiException(HttpStatus.BAD_REQUEST,
                    "최대 " + MAX_FILES + "개까지 업로드할 수 있습니다.");
        }
        for (MultipartFile file : files) {
            if (!ALLOWED_TYPES.contains(file.getContentType())) {
                throw new ApiException(HttpStatus.BAD_REQUEST,
                        "지원하지 않는 파일 형식입니다: " + file.getContentType());
            }
            if (file.getSize() > MAX_FILE_SIZE) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "파일 크기는 10MB 이하여야 합니다.");
            }
        }

        List<ConversationImage> images = conversationService.saveUploadImages(conv, files);
        // 업로드 완료(트랜잭션 커밋) 후 비동기 OCR 트리거. Python 에 없던 enqueue_ocr 연결 위치.
        ocrWorker.processOcr(conversationId, user.getNickname());
        return ImageUploadResponse.from(images);
    }

    @DeleteMapping("/{conversationId}/images")
    public Map<String, Object> deleteImages(@AuthenticationPrincipal User user,
            @PathVariable UUID conversationId) {
        int deleted = conversationService.deleteImages(user, conversationId);
        return Map.of("deleted", deleted, "message", "이미지가 삭제되었습니다.");
    }

    @GetMapping("/{conversationId}")
    public ConversationResponse get(@AuthenticationPrincipal User user,
            @PathVariable UUID conversationId) {
        Conversation conv = conversationService.getOwnedConversation(user, conversationId);
        return ConversationResponse.from(conv, conversationService.listImages(conversationId));
    }
}
