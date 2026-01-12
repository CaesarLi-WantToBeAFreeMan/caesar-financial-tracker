package com.caesarjlee.caesarfinancialtracker.exceptions.authentication;

public class UnauthenticatedException extends RuntimeException {
    public UnauthenticatedException() {
        super("unauthenticated profile");
    }
}
