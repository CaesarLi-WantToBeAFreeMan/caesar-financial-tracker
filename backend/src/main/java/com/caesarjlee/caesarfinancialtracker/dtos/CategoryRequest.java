package com.caesarjlee.caesarfinancialtracker.dtos;

import jakarta.validation.constraints.NotBlank;

public record CategoryRequest(@NotBlank String name, String icon, @NotBlank String type) {}
