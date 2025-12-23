package com.caesarjlee.caesarfinancialtracker.controllers;

import com.caesarjlee.caesarfinancialtracker.dtos.IncomeRequest;
import com.caesarjlee.caesarfinancialtracker.dtos.IncomeResponse;
import com.caesarjlee.caesarfinancialtracker.services.IncomeService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/incomes")
public class IncomeController {
    private final IncomeService incomeService;

    @PostMapping
    public ResponseEntity<IncomeResponse> addIncome(@RequestBody IncomeRequest request) {
        IncomeResponse response = incomeService.addIncome(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<IncomeResponse>> getCurrentMonthIncomes() {
        List<IncomeResponse> incomes = incomeService.getCurrentMonthIncomes();
        return ResponseEntity.ok(incomes);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIncome(@PathVariable Long id) {
        incomeService.deleteIncomeById(id);
        return ResponseEntity.noContent().build();
    }
}
