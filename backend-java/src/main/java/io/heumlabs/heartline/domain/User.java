package io.heumlabs.heartline.domain;

import io.heumlabs.heartline.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** 사용자 (카카오 OAuth, JWT 인증). models/user.py 대응. */
@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class User extends BaseEntity {

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(nullable = false, length = 50)
    private String nickname;

    /** 카카오 전용 가입자는 null. bcrypt 해시 저장(Python bcrypt 와 포맷 호환). */
    @Column(name = "hashed_password", length = 255)
    private String hashedPassword;

    @Column(length = 10)
    private String gender;

    @Column(name = "age_range", length = 10)
    private String ageRange;

    @Column(name = "kakao_oauth_id", unique = true, length = 255)
    private String kakaoOauthId;

    @Builder.Default
    @Column(name = "is_active", nullable = false)
    private boolean active = true;
}
