package com.caesarjlee.caesarfinancialtracker.exceptions.dates;

public class InvalidDateException extends RuntimeException {
    public InvalidDateException(String date) {
        super("Invalid date:" + date);
    }
}
