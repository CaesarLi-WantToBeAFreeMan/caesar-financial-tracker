package com.caesarjlee.caesarfinancialtracker.dtos;

import jakarta.validation.constraints.*;

public record RegisterRequest(@NotBlank String firstName, @NotBlank String lastName, @Email @NotBlank String email,
                              @Size(min = 8) @NotBlank String password, String profileImage) {}
