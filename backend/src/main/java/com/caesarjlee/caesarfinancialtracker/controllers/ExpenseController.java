package com.caesarjlee.caesarfinancialtracker.controllers;

import com.caesarjlee.caesarfinancialtracker.dtos.ExpenseRequest;
import com.caesarjlee.caesarfinancialtracker.dtos.ExpenseResponse;
import com.caesarjlee.caesarfinancialtracker.dtos.ImportResponse;
import com.caesarjlee.caesarfinancialtracker.services.ExpenseService;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/expenses")
public class ExpenseController {
    private final ExpenseService expenseService;

    @PostMapping
    public ResponseEntity<ExpenseResponse> create(@RequestBody @Valid ExpenseRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(expenseService.create(request));
    }

    @GetMapping
    public ResponseEntity<Page<ExpenseResponse>>
    read(@RequestParam(defaultValue = "CREATED_DESCENDING") String order,
         @RequestParam(required = false) String keyword, @RequestParam(required = false) Long categoryId,
         @RequestParam(required = false) LocalDate dateStart, @RequestParam(required = false) LocalDate dateEnd,
         @RequestParam(required = false) BigDecimal priceLow, @RequestParam(required = false) BigDecimal priceHigh,
         @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "30") int size) {
        return ResponseEntity.ok(
            expenseService.read(order, keyword, categoryId, dateStart, dateEnd, priceLow, priceHigh, page, size));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExpenseResponse> update(@PathVariable Long id, @RequestBody @Valid ExpenseRequest request) {
        return ResponseEntity.ok(expenseService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id) {
        expenseService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/import")
    public ResponseEntity<ImportResponse> importExpenses(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(expenseService.importExpense(file));
    }

    @GetMapping("/export/{type}")
    public ResponseEntity<byte []> export(@PathVariable String type) {
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=expenses." + type)
            .body(expenseService.export(type));
    }
}
