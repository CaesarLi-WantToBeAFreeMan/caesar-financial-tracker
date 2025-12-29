package com.caesarjlee.caesarfinancialtracker.exceptions.incomes;

public class IncomeNotFoundException extends RuntimeException {
    public IncomeNotFoundException(String name) {
        super("Income not found: " + name);
    }
}
