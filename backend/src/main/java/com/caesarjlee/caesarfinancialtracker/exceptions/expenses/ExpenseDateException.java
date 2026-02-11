package com.caesarjlee.caesarfinancialtracker.exceptions.expenses;

public class ExpenseDateException extends RuntimeException {
    public ExpenseDateException(String message) {
        super("Invalid date: " + message);
    }
}
