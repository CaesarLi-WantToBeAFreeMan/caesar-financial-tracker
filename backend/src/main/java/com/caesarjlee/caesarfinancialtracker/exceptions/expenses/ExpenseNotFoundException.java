package com.caesarjlee.caesarfinancialtracker.exceptions.expenses;

public class ExpenseNotFoundException extends RuntimeException {
    public ExpenseNotFoundException(String name) {
        super("Expense not found: " + name);
    }
}
