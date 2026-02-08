package com.caesarjlee.caesarfinancialtracker.exceptions.categories;

public class CategoryNameEmptyException extends RuntimeException {
    public CategoryNameEmptyException() {
        super("Empty category name");
    }
}
