package com.caesarjlee.caesarfinancialtracker.exceptions.categories;

public class CategoryInUseException extends RuntimeException {
    public CategoryInUseException(Long id) {
        super("Category is in use and cannot be deleted");
    }
}
