package com.caesarjlee.caesarfinancialtracker.exceptions;

import com.caesarjlee.caesarfinancialtracker.exceptions.authentication.*;
import com.caesarjlee.caesarfinancialtracker.exceptions.categories.*;
import com.caesarjlee.caesarfinancialtracker.exceptions.expenses.*;
import com.caesarjlee.caesarfinancialtracker.exceptions.incomes.*;
import com.caesarjlee.caesarfinancialtracker.exceptions.pages.*;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    private Map<String, Object> error(HttpStatus httpStatus, String message) {
        return Map.of("timestamp", Instant.now(), "status", httpStatus.value(), "error", httpStatus.getReasonPhrase(),
                      "message", message);
    }

    @ExceptionHandler(EmailAlreadyRegisteredException.class)
    public ResponseEntity<?> handleConflict(EmailAlreadyRegisteredException emailAlreadyRegisteredException) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
            .body(error(HttpStatus.CONFLICT, emailAlreadyRegisteredException.getMessage()));
    }

    @ExceptionHandler(ProfileNotFoundException.class)
    public ResponseEntity<?> handleNotFound(ProfileNotFoundException profileNotFoundException) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(error(HttpStatus.NOT_FOUND, profileNotFoundException.getMessage()));
    }

    @ExceptionHandler(CategoryAlreadyExistException.class)
    public ResponseEntity<?> handleConflict(CategoryAlreadyExistException categoryAlreadyExistException) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
            .body(error(HttpStatus.CONFLICT, categoryAlreadyExistException.getMessage()));
    }

    @ExceptionHandler(CategoryNotFoundException.class)
    public ResponseEntity<?> handleNotFound(CategoryNotFoundException categoryNotFoundException) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(error(HttpStatus.NOT_FOUND, categoryNotFoundException.getMessage()));
    }

    @ExceptionHandler(CategoryTypeNotFoundException.class)
    public ResponseEntity<?> handleNotFound(CategoryTypeNotFoundException categoryTypeNotFoundException) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(error(HttpStatus.NOT_FOUND, categoryTypeNotFoundException.getMessage()));
    }

    @ExceptionHandler(CategoryOrderNotFoundException.class)
    public ResponseEntity<?> handleNotFound(CategoryOrderNotFoundException categoryOrderNotFoundException) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(error(HttpStatus.NOT_FOUND, categoryOrderNotFoundException.getMessage()));
    }

    @ExceptionHandler(CategoryInUseException.class)
    public ResponseEntity<?> handleCategoryInUse(CategoryInUseException categoryInUseException) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
            .body(error(HttpStatus.CONFLICT, categoryInUseException.getMessage()));
    }

    @ExceptionHandler(IncomeNotFoundException.class)
    public ResponseEntity<?> handleNotFound(IncomeNotFoundException incomeNotFoundException) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(error(HttpStatus.NOT_FOUND, incomeNotFoundException.getMessage()));
    }

    @ExceptionHandler(IncomeUnauthorizedException.class)
    public ResponseEntity<?> handleUnauthorized(IncomeUnauthorizedException incomeUnauthorizedException) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(error(HttpStatus.UNAUTHORIZED, incomeUnauthorizedException.getMessage()));
    }

    @ExceptionHandler(ExpenseNotFoundException.class)
    public ResponseEntity<?> handleNotFound(ExpenseNotFoundException expenseNotFoundException) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(error(HttpStatus.NOT_FOUND, expenseNotFoundException.getMessage()));
    }

    @ExceptionHandler(ExpenseUnauthorizedException.class)
    public ResponseEntity<?> handleUnauthorized(ExpenseUnauthorizedException expenseUnauthorizedException) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(error(HttpStatus.UNAUTHORIZED, expenseUnauthorizedException.getMessage()));
    }

    @ExceptionHandler(PageSizeException.class)
    public ResponseEntity<?> handleUnauthorized(PageSizeException pageSizeException) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(error(HttpStatus.BAD_REQUEST, pageSizeException.getMessage()));
    }
}
