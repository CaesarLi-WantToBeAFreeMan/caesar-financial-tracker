package com.caesarjlee.caesarfinancialtracker.dtos;

import java.time.LocalDateTime;

public record ProfileDto(Long id, String firstName, String lastName, Integer age, String email, String password,
                         String profileImage, LocalDateTime createdAt, LocalDateTime updatedAt, Boolean isActive,
                         String activationToken) {}
