package com.caesarjlee.caesarfinancialtracker.exceptions.categories;

public class CategoryNameEmptyException extends RuntimeException {
    public CategoryNameEmptyException(int row) {
        super("Empty category name at row#" + row);
    }
}
