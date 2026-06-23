package io.heumlabs.heartline.domain;

import io.heumlabs.heartline.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** 파싱된 개별 메시지 (발화자 구분). models/message.py 대응. */
@Entity
@Table(name = "messages")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class Message extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "conversation_id", nullable = false)
    private Conversation conversation;

    /** "me" | "other" | "unknown". */
    @Column(name = "sender_type", nullable = false, length = 10)
    private String senderType;

    @Column(nullable = false, columnDefinition = "text")
    private String content;

    @Column(name = "sent_at")
    private OffsetDateTime sentAt;
}
