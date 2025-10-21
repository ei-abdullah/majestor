package com.majestor.api.infra.exception;

import com.sun.jdi.request.DuplicateRequestException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;

@ControllerAdvice
public class GlobalExceptionHandler {

    // Requested resource in not available
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiError> handleException(
            ResourceNotFoundException exception,
            HttpServletRequest request
    ) {
        ApiError apiError = ApiError
                .builder()
                .path(request.getRequestURI())
                .message(exception.getMessage())
                .statusCode(HttpStatus.NOT_FOUND.value())
                .localDateTime(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(apiError, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiError> handleException(
            IllegalArgumentException exception,
            HttpServletRequest request
    ) {
        ApiError apiError = ApiError
                .builder()
                .path(request.getRequestURI())
                .message(exception.getMessage())
                .statusCode(HttpStatus.BAD_REQUEST.value())
                .localDateTime(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(apiError, HttpStatus.BAD_REQUEST);
    }

    // Accessing a secured resource without valid authentication
    @ExceptionHandler(InsufficientAuthenticationException.class)
    public ResponseEntity<ApiError> handleException(
            InsufficientAuthenticationException exception,
            HttpServletRequest request
    ) {
        ApiError apiError = ApiError
                .builder()
                .path(request.getRequestURI())
                .message(exception.getMessage())
                .statusCode(HttpStatus.UNAUTHORIZED.value())
                .localDateTime(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(apiError, HttpStatus.UNAUTHORIZED);
    }

    // Invalid authentication credentials
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiError> handleException(
            BadCredentialsException exception,
            HttpServletRequest request
    ) {
        ApiError apiError = ApiError
                .builder()
                .path(request.getRequestURI())
                .message(exception.getMessage())
                .statusCode(HttpStatus.UNAUTHORIZED.value())
                .localDateTime(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(apiError, HttpStatus.UNAUTHORIZED);
    }

    // Authenticated, but lack permissions/roles
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiError> handleException(
            AccessDeniedException exception,
            HttpServletRequest request
    ) {
        ApiError apiError = ApiError
                .builder()
                .path(request.getRequestURI())
                .message(exception.getMessage())
                .statusCode(HttpStatus.FORBIDDEN.value())
                .localDateTime(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(apiError, HttpStatus.FORBIDDEN);
    }

    // Duplicating/Conflicting resource on server
    @ExceptionHandler(DuplicateRequestException.class)
    public ResponseEntity<ApiError> handleException(
            DuplicateRequestException exception,
            HttpServletRequest request
    ) {
        ApiError apiError = ApiError
                .builder()
                .path(request.getRequestURI())
                .message(exception.getMessage())
                .statusCode(HttpStatus.CONFLICT.value())
                .localDateTime(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(apiError, HttpStatus.CONFLICT);
    }

    // Invalid client's request
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleException(
            MethodArgumentNotValidException exception,
            HttpServletRequest request
    ) {
        String errorMessage = exception.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .findFirst()
                .orElse("Invalid request");

        ApiError apiError = ApiError
                .builder()
                .path(request.getRequestURI())
                .message(errorMessage)  // now human-readable
                .statusCode(HttpStatus.BAD_REQUEST.value())
                .localDateTime(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(apiError, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ApiError> handleException(
            EntityNotFoundException exception,
            HttpServletRequest request
    ) {
        ApiError apiError = ApiError
                .builder()
                .path(request.getRequestURI())
                .message(exception.getMessage())
                .statusCode(HttpStatus.NOT_FOUND.value())
                .localDateTime(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(apiError, HttpStatus.NOT_FOUND);
    }

    // Generic exception
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleException(
            Exception exception,
            HttpServletRequest request
    ) {
        ApiError apiError = ApiError
                .builder()
                .path(request.getRequestURI())
                .message(exception.getMessage())
                .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .localDateTime(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(apiError, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}