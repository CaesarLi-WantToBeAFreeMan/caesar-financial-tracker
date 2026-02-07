package com.caesarjlee.caesarfinancialtracker.exceptions.files;

public class InvalidFilenameException extends RuntimeException {
    public InvalidFilenameException() {
        super("Invalid filename");
    }
}
