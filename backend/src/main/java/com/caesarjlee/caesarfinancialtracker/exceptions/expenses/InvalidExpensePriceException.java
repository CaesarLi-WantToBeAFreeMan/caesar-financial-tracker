package com.caesarjlee.caesarfinancialtracker.exceptions.expenses;

public class InvalidExpensePriceException extends RuntimeException {
    public InvalidExpensePriceException(String name) {
        super("invalid expense price: " + name);
    }
}
