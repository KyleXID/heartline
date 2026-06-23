package io.heumlabs.heartline.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/** 업로드 저장 설정. services/conversation.py 의 UPLOAD_DIR 대응. */
@ConfigurationProperties(prefix = "heartline.upload")
public record UploadProperties(
        String dir
) {
}
