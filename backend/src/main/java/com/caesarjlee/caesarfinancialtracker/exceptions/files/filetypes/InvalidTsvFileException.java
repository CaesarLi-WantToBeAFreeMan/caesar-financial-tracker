package com.caesarjlee.caesarfinancialtracker.exceptions.files.filetypes;

public class InvalidTsvFileException extends RuntimeException {
    public InvalidTsvFileException(String file) {
        super("Invalid TSV file: " + file);
    }
}
