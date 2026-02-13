package com.caesarjlee.caesarfinancialtracker.exceptions.records;

public class RecordOrderNotFoundException extends RuntimeException {
    public RecordOrderNotFoundException(String name) {
        super("record order not found: " + name);
    }
}
