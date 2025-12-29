package com.caesarjlee.caesarfinancialtracker.exceptions.categories;

public class CategoryAlreadyExistException extends RuntimeException {
    public CategoryAlreadyExistException(String name) {
        super("Category already exist: " + name);
    }
}
