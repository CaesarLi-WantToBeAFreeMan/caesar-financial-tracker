package com.caesarjlee.caesarfinancialtracker.exceptions.records;

public class RecordNotFoundException extends RuntimeException {
    public RecordNotFoundException(String name) {
        super("record not found: " + name);
    }
}
