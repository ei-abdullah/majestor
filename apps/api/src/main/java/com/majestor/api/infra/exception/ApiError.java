package com.majestor.api.infra.exception;

import lombok.Builder;

import java.time.Instant;

@Builder
public record ApiError(
        String path,
        String message,
        int statusCode,
        Instant instantDateTime
) {
}

