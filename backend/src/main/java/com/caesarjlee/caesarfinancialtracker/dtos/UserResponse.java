package com.caesarjlee.caesarfinancialtracker.dtos;

import java.time.LocalDateTime;

public record UserResponse(Long id, String firstName, String lastName, Integer age, String email, String profileImage,
                           LocalDateTime createdAt, LocalDateTime updatedAt) {}
