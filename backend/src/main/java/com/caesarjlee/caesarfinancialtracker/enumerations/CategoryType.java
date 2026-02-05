package com.caesarjlee.caesarfinancialtracker.enumerations;

import com.caesarjlee.caesarfinancialtracker.exceptions.categories.CategoryTypeNotFoundException;

public enum CategoryType {
    INCOME,
    EXPENSE,
    ALL;

    public static CategoryType from(String value) {
        try {
            return CategoryType.valueOf(value.toUpperCase());
        } catch(Exception e) {

            throw new CategoryTypeNotFoundException(value);
        }
    }
}
