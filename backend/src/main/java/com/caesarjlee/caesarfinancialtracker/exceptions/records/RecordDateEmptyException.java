package com.caesarjlee.caesarfinancialtracker.exceptions.records;

public class RecordDateEmptyException extends RuntimeException {
    public RecordDateEmptyException() {
        super("empty record date");
    }
}
