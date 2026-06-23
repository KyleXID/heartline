package io.heumlabs.heartline.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/** schemas/auth.py 의 UserLogin 대응. */
public record LoginRequest(
        @NotBlank @Email String email,
        @NotBlank String password
) {
}
