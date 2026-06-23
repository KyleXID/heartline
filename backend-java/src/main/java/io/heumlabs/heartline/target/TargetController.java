package io.heumlabs.heartline.target;

import io.heumlabs.heartline.domain.User;
import io.heumlabs.heartline.target.dto.TargetCreateRequest;
import io.heumlabs.heartline.target.dto.TargetResponse;
import io.heumlabs.heartline.target.dto.TargetUpdateRequest;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/** api/targets.py 의 라우터 대응. */
@RestController
@RequestMapping("/api/targets")
public class TargetController {

    private final TargetService targetService;

    public TargetController(TargetService targetService) {
        this.targetService = targetService;
    }

    @GetMapping
    public List<TargetResponse> list(@AuthenticationPrincipal User user) {
        return targetService.list(user).stream().map(TargetResponse::from).toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TargetResponse create(@AuthenticationPrincipal User user,
            @Valid @RequestBody TargetCreateRequest request) {
        return TargetResponse.from(targetService.create(user, request));
    }

    @GetMapping("/{targetId}")
    public TargetResponse get(@AuthenticationPrincipal User user, @PathVariable UUID targetId) {
        return TargetResponse.from(targetService.get(user, targetId));
    }

    @PatchMapping("/{targetId}")
    public TargetResponse update(@AuthenticationPrincipal User user, @PathVariable UUID targetId,
            @Valid @RequestBody TargetUpdateRequest request) {
        return TargetResponse.from(targetService.update(user, targetId, request));
    }

    @DeleteMapping("/{targetId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@AuthenticationPrincipal User user, @PathVariable UUID targetId) {
        targetService.delete(user, targetId);
    }
}
