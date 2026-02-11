package com.caesarjlee.caesarfinancialtracker.exceptions.incomes;

public class IncomeDateException extends RuntimeException {
    public IncomeDateException(String message) {
        super("Invalid date: " + message);
    }
}
