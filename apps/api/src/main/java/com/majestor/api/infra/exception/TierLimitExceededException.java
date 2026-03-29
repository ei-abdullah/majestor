package com.majestor.api.infra.exception;

public class TierLimitExceededException extends RuntimeException {
    public TierLimitExceededException(String message) {
        super(message);
    }
}
