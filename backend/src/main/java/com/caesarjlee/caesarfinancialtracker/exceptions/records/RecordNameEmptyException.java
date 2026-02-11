package com.caesarjlee.caesarfinancialtracker.exceptions.records;

public class RecordNameEmptyException extends RuntimeException {
    public RecordNameEmptyException() {
        super("Empty record name");
    }
}
