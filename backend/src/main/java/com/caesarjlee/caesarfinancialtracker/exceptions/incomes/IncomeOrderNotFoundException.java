package com.caesarjlee.caesarfinancialtracker.exceptions.incomes;

public class IncomeOrderNotFoundException extends RuntimeException {
    public IncomeOrderNotFoundException(String name) {
        super("Income order not found: " + name);
    }
}
