package com.caesarjlee.caesarfinancialtracker.exceptions.expenses;

public class ExpensePriceException extends RuntimeException {
    public ExpensePriceException(String message) {
        super("Invalid price: " + message);
    }
}
