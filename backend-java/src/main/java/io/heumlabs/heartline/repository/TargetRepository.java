package io.heumlabs.heartline.repository;

import io.heumlabs.heartline.domain.Target;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

/** api/targets.py 의 조회 대응. 소유자 스코프 쿼리 포함. */
public interface TargetRepository extends JpaRepository<Target, UUID> {

    List<Target> findByUserIdOrderByCreatedAtDesc(UUID userId);

    Optional<Target> findByIdAndUserId(UUID id, UUID userId);
}
