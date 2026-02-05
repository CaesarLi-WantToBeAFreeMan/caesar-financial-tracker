package com.caesarjlee.caesarfinancialtracker.exceptions.categories;

public class CategoryTypeNotFoundException extends RuntimeException {
    public CategoryTypeNotFoundException(String name) {
        super("Category type not found: " + name);
    }
}
