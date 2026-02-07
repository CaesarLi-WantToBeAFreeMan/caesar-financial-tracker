package com.caesarjlee.caesarfinancialtracker.exceptions.files.filetypes;

public class InvalidFiletypeException extends RuntimeException {
    public InvalidFiletypeException(String type) {
        super("Filetype doesn't support: " + type);
    }
}
