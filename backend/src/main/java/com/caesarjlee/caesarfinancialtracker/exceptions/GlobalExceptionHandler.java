package com.caesarjlee.caesarfinancialtracker.exceptions;

import com.caesarjlee.caesarfinancialtracker.dtos.apis.ApiError;
import com.caesarjlee.caesarfinancialtracker.exceptions.authentication.*;
import com.caesarjlee.caesarfinancialtracker.exceptions.categories.*;
import com.caesarjlee.caesarfinancialtracker.exceptions.dates.*;
import com.caesarjlee.caesarfinancialtracker.exceptions.files.*;
import com.caesarjlee.caesarfinancialtracker.exceptions.files.entities.*;
import com.caesarjlee.caesarfinancialtracker.exceptions.files.filetypes.*;
import com.caesarjlee.caesarfinancialtracker.exceptions.pages.*;
import com.caesarjlee.caesarfinancialtracker.exceptions.records.*;

import org.springframework.http.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.util.stream.Collectors;

/*
 * every exception is caught and combined with its message as a JSON
 * and then send to frontend
 * frontend can always display error message use: errror.response.data.message
*/
@RestControllerAdvice
public class GlobalExceptionHandler {
    private ResponseEntity <ApiError> toResponse(HttpStatus status, String message){
        return ResponseEntity.status(status).body(ApiError.of(status.value(), status.getReasonPhrase(), message));
    }

    //Authentication/Authorization
    @ExceptionHandler(UnauthenticatedException.class)
    public ResponseEntity<ApiError> handle(UnauthenticatedException e){
        return toResponse(HttpStatus.UNAUTHORIZED, e.getMessage());
    }

    @ExceptionHandler(EmailAlreadyRegisteredException.class)
    public ResponseEntity<ApiError> handle(EmailAlreadyRegisteredException e) {
        return toResponse(HttpStatus.CONFLICT, e.getMessage());
    }

    @ExceptionHandler(ProfileNotFoundException.class)
    public ResponseEntity<ApiError> handleNotFound(ProfileNotFoundException e) {
        return toResponse(HttpStatus.NOT_FOUND, e.getMessage());
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiError> handle(AuthenticationException e){
        return toResponse(HttpStatus.UNAUTHORIZED, e.getMessage());
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiError> handle(AccessDeniedException e){
        return toResponse(HttpStatus.FORBIDDEN, e.getMessage());
    }

    //categories

    @ExceptionHandler(CategoryAlreadyExistException.class)
    public ResponseEntity<ApiError> handle(CategoryAlreadyExistException e) {
        return toResponse(HttpStatus.CONFLICT, e.getMessage());
    }

    @ExceptionHandler(CategoryNotFoundException.class)
    public ResponseEntity<ApiError> handle(CategoryNotFoundException e) {
        return toResponse(HttpStatus.NOT_FOUND, e.getMessage());
    }

    @ExceptionHandler(CategoryTypeNotFoundException.class)
    public ResponseEntity<ApiError> handle(CategoryTypeNotFoundException e) {
        return toResponse(HttpStatus.BAD_REQUEST, e.getMessage());
    }

    @ExceptionHandler(CategoryOrderNotFoundException.class)
    public ResponseEntity<ApiError> handle(CategoryOrderNotFoundException e) {
        return toResponse(HttpStatus.BAD_REQUEST, e.getMessage());
    }

    @ExceptionHandler(CategoryInUseException.class)
    public ResponseEntity<ApiError> handle(CategoryInUseException e) {
        return toResponse(HttpStatus.CONFLICT, e.getMessage());
    }

    @ExceptionHandler(CategoryNameEmptyException.class)
    public ResponseEntity<ApiError> handle(CategoryNameEmptyException e) {
        return toResponse(HttpStatus.BAD_REQUEST, e.getMessage());
    }

    @ExceptionHandler(CategoryTypeEmptyException.class)
    public ResponseEntity<ApiError> handle(CategoryTypeEmptyException e) {
        return toResponse(HttpStatus.BAD_REQUEST, e.getMessage());
    }

    @ExceptionHandler(InvalidCategoryTypeException.class)
    public ResponseEntity<ApiError> handle(InvalidCategoryTypeException e) {
        return toResponse(HttpStatus.BAD_REQUEST, e.getMessage());
    }

    //records
    @ExceptionHandler(RecordNotFoundException.class)
    public ResponseEntity<ApiError> handle(RecordNotFoundException e) {
        return toResponse(HttpStatus.NOT_FOUND, e.getMessage());
    }

    @ExceptionHandler(RecordOrderNotFoundException.class)
    public ResponseEntity<ApiError> handle(RecordOrderNotFoundException e) {
        return toResponse(HttpStatus.BAD_REQUEST, e.getMessage());
    }

    @ExceptionHandler(RecordNameEmptyException.class)
    public ResponseEntity<ApiError> handle(RecordNameEmptyException e) {
        return toResponse(HttpStatus.BAD_REQUEST, e.getMessage());
    }

    @ExceptionHandler(RecordDateEmptyException.class)
    public ResponseEntity<ApiError> handle(RecordDateEmptyException e) {
        return toResponse(HttpStatus.BAD_REQUEST, e.getMessage());
    }

    @ExceptionHandler(RecordPriceEmptyException.class)
    public ResponseEntity<ApiError> handle(RecordPriceEmptyException e) {
        return toResponse(HttpStatus.BAD_REQUEST, e.getMessage());
    }

    @ExceptionHandler(RecordTypeEmptyException.class)
    public ResponseEntity<ApiError> handle(RecordTypeEmptyException e) {
        return toResponse(HttpStatus.BAD_REQUEST, e.getMessage());
    }

    @ExceptionHandler(InvalidRecordDateException.class)
    public ResponseEntity<ApiError> handle(InvalidRecordDateException e) {
        return toResponse(HttpStatus.BAD_REQUEST, e.getMessage());
    }

    @ExceptionHandler(InvalidRecordPriceException.class)
    public ResponseEntity<ApiError> handle(InvalidRecordPriceException e) {
        return toResponse(HttpStatus.BAD_REQUEST, e.getMessage());
    }

    @ExceptionHandler(InvalidRecordTypeException.class)
    public ResponseEntity<ApiError> handle(InvalidRecordTypeException e) {
        return toResponse(HttpStatus.BAD_REQUEST, e.getMessage());
    }

    //files
    @ExceptionHandler(EmptyFileException.class)
    public ResponseEntity<ApiError> handle(EmptyFileException e) {
        return toResponse(HttpStatus.BAD_REQUEST, e.getMessage());
    }

    @ExceptionHandler(InvalidFilenameException.class)
    public ResponseEntity<ApiError> handle(InvalidFilenameException e) {
        return toResponse(HttpStatus.BAD_REQUEST, e.getMessage());
    }

    @ExceptionHandler(ExportFileException.class)
    public ResponseEntity<ApiError> handle(ExportFileException e) {
        return toResponse(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
    }

    @ExceptionHandler(InvalidFiletypeException.class)
    public ResponseEntity<ApiError> handle(InvalidFiletypeException e) {
        return toResponse(HttpStatus.UNSUPPORTED_MEDIA_TYPE, e.getMessage());
    }

    @ExceptionHandler(InvalidCsvFileException.class)
    public ResponseEntity<ApiError> handle(InvalidCsvFileException e) {
        return toResponse(HttpStatus.BAD_REQUEST, e.getMessage());
    }

    @ExceptionHandler(InvalidTsvFileException.class)
    public ResponseEntity<ApiError> handle(InvalidTsvFileException e) {
        return toResponse(HttpStatus.BAD_REQUEST, e.getMessage());
    }

    @ExceptionHandler(InvalidExcelFileException.class)
    public ResponseEntity<ApiError> handle(InvalidExcelFileException e) {
        return toResponse(HttpStatus.BAD_REQUEST, e.getMessage());
    }

    @ExceptionHandler(InvalidJsonFileException.class)
    public ResponseEntity<ApiError> handle(InvalidJsonFileException e) {
        return toResponse(HttpStatus.BAD_REQUEST, e.getMessage());
    }

    @ExceptionHandler(InvalidEntityException.class)
    public ResponseEntity<ApiError> handle(InvalidEntityException e) {
        return toResponse(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
    }

    @ExceptionHandler(InvalidFileDataException.class)
    public ResponseEntity<ApiError> handle(InvalidFileDataException e) {
        return toResponse(HttpStatus.BAD_REQUEST, e.getMessage());
    }

    @ExceptionHandler(InvalidRequiredColumnException.class)
    public ResponseEntity<ApiError> handle(InvalidRequiredColumnException e) {
        return toResponse(HttpStatus.BAD_REQUEST, e.getMessage());
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ApiError> handle(MaxUploadSizeExceededException e) {
        return toResponse(HttpStatus.PAYLOAD_TOO_LARGE, "Uploaded file is too large.");
    }

    //dates
    @ExceptionHandler(InvalidDateFormatException.class)
    public ResponseEntity<ApiError> handle(InvalidDateFormatException e) {
        return toResponse(HttpStatus.BAD_REQUEST, e.getMessage());
    }

    //paginations
    @ExceptionHandler(PageSizeException.class)
    public ResponseEntity<ApiError> handle(PageSizeException e) {
        return toResponse(HttpStatus.BAD_REQUEST, e.getMessage());
    }

    //bean validations
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handle(MethodArgumentNotValidException e) {
        String message = e.getBindingResult().getFieldErrors()
                                            .stream()
                                            .map(FieldError::getDefaultMessage)
                                            .collect(Collectors.joining("; "));
        return toResponse(HttpStatus.BAD_REQUEST, message);
    }

    //other exception
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleAll(Exception e) {
        e.printStackTrace();
        return toResponse(HttpStatus.INTERNAL_SERVER_ERROR,
                        "An unexpected error occurred: " + e.getMessage());
    }
}
