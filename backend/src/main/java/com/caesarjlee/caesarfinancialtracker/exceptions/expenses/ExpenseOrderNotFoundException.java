package com.caesarjlee.caesarfinancialtracker.exceptions.expenses;

public class ExpenseOrderNotFoundException extends RuntimeException {
    public ExpenseOrderNotFoundException(String name) {
        super("Expense order not found: " + name);
    }
}
