package com.caesarjlee.caesarfinancialtracker.exceptions.files.filetypes;

public class InvalidJsonFileException extends RuntimeException {
    public InvalidJsonFileException(String file) {
        super("Invalid JSON file: " + file);
    }
}
