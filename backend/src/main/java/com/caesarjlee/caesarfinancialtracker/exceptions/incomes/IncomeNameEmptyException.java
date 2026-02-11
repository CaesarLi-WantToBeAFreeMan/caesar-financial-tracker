package com.caesarjlee.caesarfinancialtracker.exceptions.incomes;

public class IncomeNameEmptyException extends RuntimeException {
    public IncomeNameEmptyException() {
        super("Empty income name");
    }
}
