package com.caesarjlee.caesarfinancialtracker.exceptions.files.entities;

public class InvalidRequiredColumnException extends RuntimeException {
    public InvalidRequiredColumnException(String column) {
        super("Invalid required column: " + column);
    }
}
