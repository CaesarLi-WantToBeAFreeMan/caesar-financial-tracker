package com.caesarjlee.caesarfinancialtracker.dtos.apis;

import java.time.Instant;

/**
 * error response body send to frontend for every exception
 * form: {"timestamp": "...", "status", 404, "error": "Not Found", "message": "..."}
 */
public record ApiError(Instant timestamp, int status, String error, String message) {
    public static ApiError of(int status, String error, String message){
        return new ApiError(Instant.now(), status, error, message);
    }
}
