package com.caesarjlee.caesarfinancialtracker.exceptions.records;

public class InvalidRecordTypeException extends RuntimeException {
    public InvalidRecordTypeException(String type) {
        super("invalid record type (only income/expense): " + type);
    }
}
