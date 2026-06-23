package io.heumlabs.heartline.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

/**
 * 비동기 작업 실행자. {@code @EnableAsync} 기본값(SimpleAsyncTaskExecutor)은 호출마다 스레드를
 * 무제한 생성하므로, CPU 집약적인 OCR 워커용으로 풀 크기가 제한된 전용 executor 를 둔다.
 */
@Configuration
public class AsyncConfig {

    @Bean(name = "ocrTaskExecutor")
    public ThreadPoolTaskExecutor ocrTaskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(2);
        executor.setMaxPoolSize(4);
        executor.setQueueCapacity(50);
        executor.setThreadNamePrefix("ocr-");
        executor.initialize();
        return executor;
    }
}
