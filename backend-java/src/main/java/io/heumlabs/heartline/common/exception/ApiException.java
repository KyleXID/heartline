package io.heumlabs.heartline.common.exception;

import org.springframework.http.HttpStatus;

/** FastAPI HTTPException(status_code, detail) 대응. */
public class ApiException extends RuntimeException {

    private final HttpStatus status;

    public ApiException(HttpStatus status, String detail) {
        super(detail);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
