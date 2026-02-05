package com.caesarjlee.caesarfinancialtracker.exceptions.pages;

public class PageSizeException extends RuntimeException {
    public PageSizeException(String name) {
        super("Invalid page size:" + name);
    }
}
