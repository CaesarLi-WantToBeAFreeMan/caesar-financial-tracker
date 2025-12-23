package com.caesarjlee.caesarfinancialtracker.dtos;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record RecentTransaction(String name, String categoryName, String type, BigDecimal price, LocalDate date,
                                LocalDateTime createdAt, LocalDateTime updatedAt) {}
