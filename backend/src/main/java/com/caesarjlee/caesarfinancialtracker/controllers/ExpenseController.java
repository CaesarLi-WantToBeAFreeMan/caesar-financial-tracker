package com.caesarjlee.caesarfinancialtracker.controllers;

import com.caesarjlee.caesarfinancialtracker.dtos.ExpenseRequest;
import com.caesarjlee.caesarfinancialtracker.dtos.ExpenseResponse;
import com.caesarjlee.caesarfinancialtracker.services.ExpenseService;

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
@RequestMapping("/expenses")
public class ExpenseController {
    private final ExpenseService expenseService;

    @PostMapping
    public ResponseEntity<ExpenseResponse> addExpense(@RequestBody ExpenseRequest request) {
        ExpenseResponse response = expenseService.addExpense(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<ExpenseResponse>> getCurrentMonthExpenses() {
        List<ExpenseResponse> expenses = expenseService.getCurrentMonthExpenses();
        return ResponseEntity.ok(expenses);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id) {
        expenseService.deleteExpenseById(id);
        return ResponseEntity.noContent().build();
    }
}
