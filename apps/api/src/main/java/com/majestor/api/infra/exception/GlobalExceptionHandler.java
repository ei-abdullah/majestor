package com.majestor.api.infra.exception;

import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.ValidationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.validation.BindException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;

@ControllerAdvice
public class GlobalExceptionHandler {

    // Validation errors
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiError> handleException(
            ConstraintViolationException exception,
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

    // Invalid form-data syntax in model attribute
    @ExceptionHandler(BindException.class)
    public ResponseEntity<ApiError> handleException(
            BindException exception,
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

    // Invalid JSON syntax in the request body
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiError> handleException(
            HttpMessageNotReadableException exception,
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

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ApiError> handleException(
            ValidationException exception,
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

    // Account exists but email not verified
    @ExceptionHandler(DisabledException.class)
    public ResponseEntity<ApiError> handleException(
            DisabledException exception,
            HttpServletRequest request
    ) {
        ApiError apiError = ApiError
                .builder()
                .path(request.getRequestURI())
                .message("Please verify your email before logging in!")
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
    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ApiError> handleException(
            DuplicateResourceException exception,
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
        ApiError apiError = ApiError
                .builder()
                .path(request.getRequestURI())
                .message(exception.getMessage())
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