package com.caesarjlee.caesarfinancialtracker.exceptions;

public class InvalidDateException extends RuntimeException {
    public InvalidDateException(String date) {
        super("Invalid date:" + date);
    }
}
