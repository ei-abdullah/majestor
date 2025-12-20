package com.majestor.api.infra.exception;

import lombok.Builder;

import java.time.LocalDateTime;
import java.util.List;

@Builder
public record ApiError(
        String path,
        String message,
        int statusCode,
        LocalDateTime localDateTime
) {
}

