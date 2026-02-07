package com.caesarjlee.caesarfinancialtracker.exceptions.files.filetypes;

public class InvalidCsvFileException extends RuntimeException {
    public InvalidCsvFileException(String file) {
        super("Invalid CSV file: " + file);
    }
}
