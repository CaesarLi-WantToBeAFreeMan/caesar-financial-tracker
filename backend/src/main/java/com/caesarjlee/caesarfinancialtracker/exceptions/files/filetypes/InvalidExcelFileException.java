package com.caesarjlee.caesarfinancialtracker.exceptions.files.filetypes;

public class InvalidExcelFileException extends RuntimeException {
    public InvalidExcelFileException(String file) {
        super("Invalid Excel file: " + file);
    }
}
