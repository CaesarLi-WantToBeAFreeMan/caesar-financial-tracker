package com.caesarjlee.caesarfinancialtracker.dtos;

import com.caesarjlee.caesarfinancialtracker.enumerations.TransactionTypes;

import jakarta.validation.constraints.Pattern;
import java.time.LocalDate;

public record FilterRequest(TransactionTypes type, LocalDate startDate, LocalDate endDate, String keyword, String field,
                            @Pattern(regexp = "asc|desc", flags = Pattern.Flag.CASE_INSENSITIVE,
                                     message = "order must be 'asc' or 'desc'") String order) {}
