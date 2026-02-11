package com.caesarjlee.caesarfinancialtracker.exceptions.records;

public class InvalidRecordDateException extends RuntimeException {
    public InvalidRecordDateException(String message) {
        super("invalid record date: " + message);
    }
}
