package io.heumlabs.heartline.target;

import io.heumlabs.heartline.common.exception.ApiException;
import io.heumlabs.heartline.domain.Target;
import io.heumlabs.heartline.domain.User;
import io.heumlabs.heartline.repository.TargetRepository;
import io.heumlabs.heartline.target.dto.TargetCreateRequest;
import io.heumlabs.heartline.target.dto.TargetUpdateRequest;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** api/targets.py 의 비즈니스 로직 대응. */
@Service
public class TargetService {

    private final TargetRepository targetRepository;

    public TargetService(TargetRepository targetRepository) {
        this.targetRepository = targetRepository;
    }

    @Transactional(readOnly = true)
    public List<Target> list(User user) {
        return targetRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }

    @Transactional
    public Target create(User user, TargetCreateRequest request) {
        return targetRepository.save(Target.builder()
                .user(user)
                .nickname(request.nickname())
                .memo(request.memo())
                .relationshipGoal(request.relationshipGoal())
                .build());
    }

    @Transactional(readOnly = true)
    public Target get(User user, UUID targetId) {
        return getOwnedTarget(user, targetId);
    }

    @Transactional
    public Target update(User user, UUID targetId, TargetUpdateRequest request) {
        Target target = getOwnedTarget(user, targetId);
        // 부분 수정: null 이 아닌 필드만 반영
        if (request.nickname() != null) {
            target.setNickname(request.nickname());
        }
        if (request.memo() != null) {
            target.setMemo(request.memo());
        }
        if (request.relationshipGoal() != null) {
            target.setRelationshipGoal(request.relationshipGoal());
        }
        return target;
    }

    @Transactional
    public void delete(User user, UUID targetId) {
        Target target = getOwnedTarget(user, targetId);
        targetRepository.delete(target);
    }

    private Target getOwnedTarget(User user, UUID targetId) {
        return targetRepository.findByIdAndUserId(targetId, user.getId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "대상을 찾을 수 없습니다."));
    }
}
