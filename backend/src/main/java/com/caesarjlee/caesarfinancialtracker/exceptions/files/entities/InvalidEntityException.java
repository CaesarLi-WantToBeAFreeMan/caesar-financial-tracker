package com.caesarjlee.caesarfinancialtracker.exceptions.files.entities;

public class InvalidEntityException extends RuntimeException {
    public InvalidEntityException(String entity) {
        super("Invalid entity: " + entity);
    }
}
