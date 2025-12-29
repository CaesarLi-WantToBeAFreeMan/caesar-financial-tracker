package com.caesarjlee.caesarfinancialtracker.exceptions.authentication;

public class ProfileNotFoundException extends RuntimeException {
    public ProfileNotFoundException(String email) {
        super("Profile not found: " + email);
    }
}
