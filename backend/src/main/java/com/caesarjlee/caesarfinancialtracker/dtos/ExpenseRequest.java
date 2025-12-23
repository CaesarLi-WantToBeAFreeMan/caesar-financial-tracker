package com.caesarjlee.caesarfinancialtracker.dtos;

import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;
import java.time.LocalDate;

public record ExpenseRequest(@NotBlank String name, String icon, LocalDate date, BigDecimal price, String description,
                             Long categoryId) {}
