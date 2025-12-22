package com.caesarjlee.caesarfinancialtracker.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record
    RegisterRequest(@NotBlank String firstName, @NotBlank String lastName, @Min(0) Integer age,
                    @Email @NotBlank String email, @Size(min = 8) @NotBlank String password, String profileImage) {}
