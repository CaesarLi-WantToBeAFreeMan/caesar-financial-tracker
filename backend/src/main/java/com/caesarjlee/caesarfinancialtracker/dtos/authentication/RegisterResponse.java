package com.caesarjlee.caesarfinancialtracker.dtos.authentication;

import java.time.LocalDateTime;

public record RegisterResponse(Long id, String firstName, String lastName, String email, String profileImage,
                               LocalDateTime createdAt, LocalDateTime updatedAt) {}
