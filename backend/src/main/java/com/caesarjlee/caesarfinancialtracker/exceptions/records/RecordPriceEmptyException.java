package com.caesarjlee.caesarfinancialtracker.exceptions.records;

public class RecordPriceEmptyException extends RuntimeException {
    public RecordPriceEmptyException() {
        super("empty record price");
    }
}
