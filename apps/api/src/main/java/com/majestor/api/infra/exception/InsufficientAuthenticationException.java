package com.majestor.api.infra.exception;

public class InsufficientAuthenticationException extends RuntimeException {
    public InsufficientAuthenticationException(String message) {
        super(message);
    }
}
