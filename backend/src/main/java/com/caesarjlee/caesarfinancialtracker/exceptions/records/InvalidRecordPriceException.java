package com.caesarjlee.caesarfinancialtracker.exceptions.records;

public class InvalidRecordPriceException extends RuntimeException {
    public InvalidRecordPriceException(String message) {
        super("invalid record price: " + message);
    }
}
