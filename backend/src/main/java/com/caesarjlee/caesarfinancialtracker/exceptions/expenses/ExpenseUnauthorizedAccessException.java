package com.caesarjlee.caesarfinancialtracker.exceptions.expenses;

public class ExpenseUnauthorizedAccessException extends RuntimeException {
    public ExpenseUnauthorizedAccessException(Long id) {
        super("Unauthorized access to expense No." + id);
    }
}
