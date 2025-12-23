package com.caesarjlee.caesarfinancialtracker.dtos;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record ExpenseResponse(Long id, String name, String icon, LocalDate date, BigDecimal price, String description,
                              LocalDateTime createdAt, LocalDateTime updatedAt, String categoryName) {}
