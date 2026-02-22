package com.caesarjlee.caesarfinancialtracker.dtos.records;

import java.math.BigDecimal;
import java.time.*;

public record RecordResponse(
    Long id,
    String name,
    String type,
    String icon,
    LocalDate date,
    BigDecimal price,
    String description,
    LocalDateTime createdAt,
    LocalDateTime updatedAt,
    Long categoryId
) {
}
