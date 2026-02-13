package com.caesarjlee.caesarfinancialtracker.exceptions.records;

public class RecordTypeEmptyException extends RuntimeException {
    public RecordTypeEmptyException() {
        super("Empty record type");
    }
}
