package com.caesarjlee.caesarfinancialtracker.exceptions.incomes;

public class InvalidIncomeDateException extends RuntimeException {
    public InvalidIncomeDateException(String name) {
        super("invalid income date: " + name);
    }
}
