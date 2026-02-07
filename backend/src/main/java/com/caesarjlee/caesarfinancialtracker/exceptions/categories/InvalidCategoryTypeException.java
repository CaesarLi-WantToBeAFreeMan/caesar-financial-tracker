package com.caesarjlee.caesarfinancialtracker.exceptions.categories;

public class InvalidCategoryTypeException extends RuntimeException {
    public InvalidCategoryTypeException(String type, int row) {
        super("Invalid category type: " + type + " at row#" + row);
    }
}
