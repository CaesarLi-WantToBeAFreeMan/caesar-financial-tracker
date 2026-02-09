package com.caesarjlee.caesarfinancialtracker.exceptions.files;

public class ExportFileException extends RuntimeException {
    public ExportFileException() {
        super("export a file failed");
    }
}
