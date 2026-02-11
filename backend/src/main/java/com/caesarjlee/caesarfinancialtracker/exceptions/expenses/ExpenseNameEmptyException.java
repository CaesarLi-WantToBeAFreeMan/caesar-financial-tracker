package com.caesarjlee.caesarfinancialtracker.exceptions.expenses;

public class ExpenseNameEmptyException extends RuntimeException {
    public ExpenseNameEmptyException() {
        super("Empty expense name");
    }
}
