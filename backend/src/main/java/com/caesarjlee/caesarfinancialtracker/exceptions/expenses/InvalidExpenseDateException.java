package com.caesarjlee.caesarfinancialtracker.exceptions.expenses;

public class InvalidExpenseDateException extends RuntimeException {
    public InvalidExpenseDateException(String name) {
        super("invalid expense date: " + name);
    }
}
