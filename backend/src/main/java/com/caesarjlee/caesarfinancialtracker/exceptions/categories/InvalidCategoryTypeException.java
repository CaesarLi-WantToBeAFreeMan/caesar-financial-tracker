package com.caesarjlee.caesarfinancialtracker.exceptions.categories;

public class InvalidCategoryTypeException extends RuntimeException {
    public InvalidCategoryTypeException(String type) {
        super("Invalid category type: " + type);
    }
}
