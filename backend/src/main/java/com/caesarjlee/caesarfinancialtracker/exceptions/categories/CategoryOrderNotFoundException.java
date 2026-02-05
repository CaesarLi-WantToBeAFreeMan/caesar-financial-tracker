package com.caesarjlee.caesarfinancialtracker.exceptions.categories;

public class CategoryOrderNotFoundException extends RuntimeException {
    public CategoryOrderNotFoundException(String name) {
        super("Category order not found: " + name);
    }
}
