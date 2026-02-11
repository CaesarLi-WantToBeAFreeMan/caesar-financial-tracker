package com.caesarjlee.caesarfinancialtracker.exceptions.incomes;

public class IncomePriceException extends RuntimeException {
    public IncomePriceException(String message) {
        super("Invalid price: " + message);
    }
}
