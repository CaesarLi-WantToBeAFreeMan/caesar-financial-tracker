package com.caesarjlee.caesarfinancialtracker.exceptions.incomes;

public class IncomeUnauthorizedException extends RuntimeException {
    public IncomeUnauthorizedException(String name) {
        super("Unauthorized Income Permission " + name);
    }
}
