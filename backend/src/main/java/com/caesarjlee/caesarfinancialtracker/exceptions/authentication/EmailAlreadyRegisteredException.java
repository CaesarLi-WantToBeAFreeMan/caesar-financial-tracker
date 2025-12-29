package com.caesarjlee.caesarfinancialtracker.exceptions.authentication;

public class EmailAlreadyRegisteredException extends RuntimeException {
    public EmailAlreadyRegisteredException(String email) {
        super("Email already registered: " + email);
    }
}
