package com.caesarjlee.caesarfinancialtracker.exceptions.authentication;

public class ProfileNotFoundException extends RuntimeException {
    public ProfileNotFoundException() {
        super("incorrect username or password");
    }
}
