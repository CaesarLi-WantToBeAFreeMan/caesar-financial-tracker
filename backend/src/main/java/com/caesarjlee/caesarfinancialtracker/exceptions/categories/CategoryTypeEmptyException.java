package com.caesarjlee.caesarfinancialtracker.exceptions.categories;

public class CategoryTypeEmptyException extends RuntimeException {
    public CategoryTypeEmptyException() {
        super("Empty category type");
    }
}
