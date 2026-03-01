package com.caesarjlee.caesarfinancialtracker.dtos.profiles;

import jakarta.validation.constraints.*;

public record ProfileRequest(String firstName, String lastName, @Email @NotBlank String email, String password, String profileImage){}
