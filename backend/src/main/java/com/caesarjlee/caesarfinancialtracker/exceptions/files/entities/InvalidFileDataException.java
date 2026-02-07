package com.caesarjlee.caesarfinancialtracker.exceptions.files.entities;

public class InvalidFileDataException extends RuntimeException {
    public InvalidFileDataException(String file) {
        super("Cannot import data from file: " + file);
    }
}
