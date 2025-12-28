package com.caesarjlee.caesarfinancialtracker.controllers;

import com.caesarjlee.caesarfinancialtracker.dtos.FilterRequest;
import com.caesarjlee.caesarfinancialtracker.services.ExpenseService;
import com.caesarjlee.caesarfinancialtracker.services.IncomeService;

import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.Optional;
import java.util.Set;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/filter")
public class FilterController {
    private final ExpenseService expenseService;
    private final IncomeService  incomeService;

    private static final Set<String> SORT_FIELDS = Set.of("date", "price", "name");

    @PostMapping("")
    public ResponseEntity<?> filterTransactions(@Valid @RequestBody FilterRequest request) {
        LocalDate startDate      = Optional.ofNullable(request.startDate()).orElse(LocalDate.MIN),
                  endDate        = Optional.ofNullable(request.endDate()).orElse(LocalDate.now());
        String keyword           = Optional.ofNullable(request.keyword()).orElse(""),
               field             = Optional.ofNullable(request.field()).orElse("date");
        Sort.Direction direction = "desc".equalsIgnoreCase(request.order()) ? Sort.Direction.DESC : Sort.Direction.ASC;
        Sort           sort      = Sort.by(direction, field);
        return switch(request.type()) {
            case INCOME  -> ResponseEntity.ok(incomeService.filterIncome(startDate, endDate, keyword, sort));
            case EXPENSE -> ResponseEntity.ok(expenseService.filterExpense(startDate, endDate, keyword, sort));
            default      -> ResponseEntity.badRequest().body("Unsupported type");
        };
    }
}
