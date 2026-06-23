package io.heumlabs.heartline.analysis;

import io.heumlabs.heartline.analysis.dto.AnalysisResultResponse;
import io.heumlabs.heartline.analysis.dto.AnalyzeRequest;
import io.heumlabs.heartline.common.exception.ApiException;
import io.heumlabs.heartline.domain.AnalysisResult;
import io.heumlabs.heartline.domain.User;
import jakarta.validation.Valid;
import java.util.Optional;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** api/analysis.py 의 라우터 대응. 캐시 오케스트레이션만 담당하고 도메인 규칙은 서비스에 위임한다. */
@RestController
@RequestMapping("/api/analysis")
public class AnalysisController {

    private final AnalysisService analysisService;
    private final AnalysisCacheService cacheService;

    public AnalysisController(AnalysisService analysisService, AnalysisCacheService cacheService) {
        this.analysisService = analysisService;
        this.cacheService = cacheService;
    }

    @PostMapping
    public AnalysisResultResponse analyze(@AuthenticationPrincipal User user,
            @Valid @RequestBody AnalyzeRequest request) {
        UUID conversationId = request.conversationId();

        // 재분석 시 캐시 무효화
        cacheService.invalidate(conversationId.toString());

        AnalysisResult result;
        try {
            result = analysisService.runAnalysis(user, conversationId); // 소유권 검증 포함
        } catch (ApiException e) {
            throw e; // 400(메시지 없음)/404(대화 없음) 등은 그대로
        } catch (Exception e) {
            throw new ApiException(HttpStatus.BAD_GATEWAY,
                    "AI 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        }

        AnalysisResultResponse response = AnalysisResultResponse.from(result);
        cacheService.set(conversationId.toString(), response);
        return response;
    }

    @GetMapping("/{conversationId}")
    public AnalysisResultResponse get(@AuthenticationPrincipal User user,
            @PathVariable UUID conversationId) {
        // 보안: 캐시 조회 전에 소유권부터 검증
        analysisService.requireOwnedConversation(user, conversationId);

        Optional<AnalysisResultResponse> cached = cacheService.get(conversationId.toString());
        if (cached.isPresent()) {
            return cached.get();
        }

        AnalysisResultResponse response = AnalysisResultResponse.from(
                analysisService.findResult(conversationId));
        cacheService.set(conversationId.toString(), response);
        return response;
    }
}
