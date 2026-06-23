package io.heumlabs.heartline.conversation;

import io.heumlabs.heartline.common.exception.ApiException;
import io.heumlabs.heartline.config.UploadProperties;
import io.heumlabs.heartline.conversation.dto.ConversationListItem;
import io.heumlabs.heartline.domain.AnalysisResult;
import io.heumlabs.heartline.domain.Conversation;
import io.heumlabs.heartline.domain.ConversationImage;
import io.heumlabs.heartline.domain.User;
import io.heumlabs.heartline.repository.AnalysisResultRepository;
import io.heumlabs.heartline.repository.ConversationImageRepository;
import io.heumlabs.heartline.repository.ConversationRepository;
import io.heumlabs.heartline.repository.TargetRepository;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.FileSystemUtils;
import org.springframework.web.multipart.MultipartFile;

/** api/conversations + services/conversation.py 의 비즈니스 로직 대응. */
@Service
public class ConversationService {

    private final ConversationRepository conversationRepository;
    private final ConversationImageRepository imageRepository;
    private final TargetRepository targetRepository;
    private final AnalysisResultRepository analysisResultRepository;
    private final UploadProperties uploadProperties;

    public ConversationService(ConversationRepository conversationRepository,
            ConversationImageRepository imageRepository, TargetRepository targetRepository,
            AnalysisResultRepository analysisResultRepository, UploadProperties uploadProperties) {
        this.conversationRepository = conversationRepository;
        this.imageRepository = imageRepository;
        this.targetRepository = targetRepository;
        this.analysisResultRepository = analysisResultRepository;
        this.uploadProperties = uploadProperties;
    }

    @Transactional
    public Conversation createConversation(User user, UUID targetId) {
        // 원본(create_conversation)과 동일하게 target 소유 검증 없이 FK 만 저장.
        Conversation conv = Conversation.builder()
                .user(user)
                .target(targetRepository.getReferenceById(targetId))
                .status("pending")
                .build();
        return conversationRepository.save(conv);
    }

    @Transactional(readOnly = true)
    public Conversation getOwnedConversation(User user, UUID conversationId) {
        return findOwned(user, conversationId);
    }

    private Conversation findOwned(User user, UUID conversationId) {
        return conversationRepository.findByIdAndUserId(conversationId, user.getId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "대화를 찾을 수 없습니다."));
    }

    @Transactional(readOnly = true)
    public List<ConversationImage> listImages(UUID conversationId) {
        return imageRepository.findByConversationIdOrderByOrderAsc(conversationId);
    }

    @Transactional
    public List<ConversationImage> saveUploadImages(Conversation conv, List<MultipartFile> files) {
        int startOrder = (int) imageRepository.countByConversationId(conv.getId());
        Path convDir = uploadRoot().resolve("conversations").resolve(conv.getId().toString());
        try {
            Files.createDirectories(convDir);
        } catch (IOException e) {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "업로드 디렉터리를 만들 수 없습니다.");
        }

        List<ConversationImage> images = new ArrayList<>();
        for (int i = 0; i < files.size(); i++) {
            MultipartFile file = files.get(i);
            String filename = UUID.randomUUID().toString().replace("-", "")
                    + extractExtension(file.getOriginalFilename());
            Path filepath = convDir.resolve(filename);
            try (InputStream in = file.getInputStream()) {
                Files.copy(in, filepath);
            } catch (IOException e) {
                throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "파일 저장에 실패했습니다.");
            }
            images.add(imageRepository.save(ConversationImage.builder()
                    .conversation(conv)
                    .imageFile(filepath.toString())
                    .order(startOrder + i)
                    .build()));
        }
        return images;
    }

    @Transactional(readOnly = true)
    public List<ConversationListItem> list(User user) {
        return conversationRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(conv -> {
                    AnalysisResult ar =
                            analysisResultRepository.findByConversationId(conv.getId()).orElse(null);
                    int imageCount = (int) imageRepository.countByConversationId(conv.getId());
                    String nickname =
                            conv.getTarget() != null ? conv.getTarget().getNickname() : "알 수 없음";
                    return new ConversationListItem(
                            conv.getId(),
                            conv.getTarget() != null ? conv.getTarget().getId() : null,
                            nickname,
                            conv.getStatus(),
                            conv.getCreatedAt(),
                            imageCount,
                            ar != null ? ar.getInterestScore() : null,
                            ar != null ? ar.getTemperature() : null);
                })
                .toList();
    }

    /** 분석 완료 후 이미지 물리 삭제(개인정보). image_file 은 null 로 비우고 ocr_text 는 보존. */
    @Transactional
    public int deleteImages(User user, UUID conversationId) {
        findOwned(user, conversationId);

        Path convDir = uploadRoot().resolve("conversations").resolve(conversationId.toString());
        FileSystemUtils.deleteRecursively(convDir.toFile());

        List<ConversationImage> images = imageRepository.findByConversationIdOrderByOrderAsc(conversationId);
        images.forEach(img -> img.setImageFile(null));
        return images.size();
    }

    private Path uploadRoot() {
        return Paths.get(uploadProperties.dir());
    }

    private String extractExtension(String filename) {
        String name = (filename == null || filename.isBlank()) ? "image.png" : filename;
        int dot = name.lastIndexOf('.');
        return dot >= 0 ? name.substring(dot) : "";
    }
}
