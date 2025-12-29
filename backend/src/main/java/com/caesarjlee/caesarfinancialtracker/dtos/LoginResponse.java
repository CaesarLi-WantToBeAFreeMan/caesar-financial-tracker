package com.caesarjlee.caesarfinancialtracker.dtos;

import java.time.LocalDateTime;

public record LoginResponse(String token, Long id, String firstName, String lastName, String email, String profileImage,
                            LocalDateTime createdAt, LocalDateTime updatedAt) {}
