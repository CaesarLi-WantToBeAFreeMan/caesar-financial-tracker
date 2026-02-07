package com.caesarjlee.caesarfinancialtracker.exceptions.files;

public class EmptyFileException extends RuntimeException {
    public EmptyFileException() {
        super("empty file");
    }
}
