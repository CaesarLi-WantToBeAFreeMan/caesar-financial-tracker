package com.caesarjlee.caesarfinancialtracker.exceptions.expenses;

public class ExpenseUnauthorizedException extends RuntimeException {
    public ExpenseUnauthorizedException(String name) {
        super("Unauthorized Expense Permission");
    }
}
