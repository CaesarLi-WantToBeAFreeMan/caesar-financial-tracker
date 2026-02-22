package com.caesarjlee.caesarfinancialtracker.controllers;

import com.caesarjlee.caesarfinancialtracker.dtos.records.*;
import com.caesarjlee.caesarfinancialtracker.dtos.ImportResponse;
import com.caesarjlee.caesarfinancialtracker.services.RecordService;

import org.springframework.data.domain.Page;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/records")
public class RecordController {
    private final RecordService recordService;

    @PostMapping
    public ResponseEntity<RecordResponse> create(@RequestBody @Valid RecordRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(recordService.create(request));
    }

    @GetMapping
    public ResponseEntity<Page<RecordResponse>>
    read(@RequestParam(defaultValue = "CREATED_DESCENDING") String order,
         @RequestParam(required = false) String keyword, @RequestParam(required = false) String type,
         @RequestParam(required = false) Long categoryId, @RequestParam(required = false) LocalDate dateStart,
         @RequestParam(required = false) LocalDate dateEnd, @RequestParam(required = false) BigDecimal priceLow,
         @RequestParam(required = false) BigDecimal priceHigh, @RequestParam(defaultValue = "0") int page,
         @RequestParam(defaultValue = "30") int size) {
        return ResponseEntity.ok(
            recordService.read(order, type, keyword, categoryId, dateStart, dateEnd, priceLow, priceHigh, page, size));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RecordResponse> update(@PathVariable Long id, @RequestBody @Valid RecordRequest request) {
        return ResponseEntity.ok(recordService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        recordService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/import")
    public ResponseEntity<ImportResponse> importRecord(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(recordService.importRecord(file));
    }

    @GetMapping("/export/{type}")
    public ResponseEntity<byte []> export(@PathVariable String type) {
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=incomes." + type)
            .body(recordService.export(type));
    }
}
