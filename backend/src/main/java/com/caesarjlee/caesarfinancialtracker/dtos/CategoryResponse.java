package com.caesarjlee.caesarfinancialtracker.dtos;

import java.time.LocalDateTime;

public record
    CategoryResponse(Long id, String name, String type, String icon, LocalDateTime createdAt, LocalDateTime updatedAt) {
}
