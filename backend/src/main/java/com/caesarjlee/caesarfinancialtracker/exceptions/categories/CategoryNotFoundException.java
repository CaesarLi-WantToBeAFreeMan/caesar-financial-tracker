package com.caesarjlee.caesarfinancialtracker.exceptions.categories;

public class CategoryNotFoundException extends RuntimeException {
    public CategoryNotFoundException(String name) {
        super("Category not found: " + name);
    }
}
