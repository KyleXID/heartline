package io.heumlabs.heartline.domain;

import io.heumlabs.heartline.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** 업로드 이미지 (OCR 텍스트). models/conversation_image.py 대응. */
@Entity
@Table(name = "conversation_images")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class ConversationImage extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "conversation_id", nullable = false)
    private Conversation conversation;

    /** 업로드된 파일 경로. 분석 후 이미지 삭제(개인정보 보호) 시 null 로 비운다(ocr_text 는 보존). */
    @Column(name = "image_file", length = 500)
    private String imageFile;

    /** 업로드 순서. "order" 는 SQL 예약어라 따옴표로 escape. */
    @Builder.Default
    @Column(name = "\"order\"", nullable = false)
    private int order = 0;

    /** OCR 결과. 미처리 시 null. */
    @Column(name = "ocr_text", columnDefinition = "text")
    private String ocrText;
}
