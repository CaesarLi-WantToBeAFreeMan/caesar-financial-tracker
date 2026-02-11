package com.caesarjlee.caesarfinancialtracker.exceptions.incomes;

public class InvalidIncomePriceException extends RuntimeException {
    public InvalidIncomePriceException(String name) {
        super("invalid income price: " + name);
    }
}
