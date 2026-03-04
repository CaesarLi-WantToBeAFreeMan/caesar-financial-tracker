package com.caesarjlee.caesarfinancialtracker.dtos.authentication;

import jakarta.validation.constraints.*;

public record LoginRequest(@Email @NotBlank String email, @Size(min = 8) @NotBlank String password) {}
