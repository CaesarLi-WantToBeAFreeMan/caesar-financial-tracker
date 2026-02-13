package com.caesarjlee.caesarfinancialtracker.dtos.records;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;

public record RecordRequest(
    @NotBlank String name,
    String type,
    String icon,
    LocalDate date,
    BigDecimal price,
    String description,
    Long categoryId
) {
}
