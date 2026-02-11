package com.caesarjlee.caesarfinancialtracker.exceptions.dates;

public class InvalidDateFormatException extends RuntimeException {
    public InvalidDateFormatException() {
        super("invalid date format");
    }
}
