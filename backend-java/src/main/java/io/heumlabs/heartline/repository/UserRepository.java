package io.heumlabs.heartline.repository;

import io.heumlabs.heartline.domain.User;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

/** services/auth.py 의 get_user_by_email + 카카오 조회 대응. */
public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmail(String email);

    Optional<User> findByKakaoOauthId(String kakaoOauthId);

    boolean existsByEmail(String email);
}
