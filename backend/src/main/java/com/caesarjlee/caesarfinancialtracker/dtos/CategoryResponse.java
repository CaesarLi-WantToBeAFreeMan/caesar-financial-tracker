package com.caesarjlee.caesarfinancialtracker.dtos;

import java.time.LocalDateTime;

public record
    CategoryResponse(String name, String type, String icon, LocalDateTime createdAt, LocalDateTime updatedAt) {}
