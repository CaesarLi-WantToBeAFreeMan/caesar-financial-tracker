package com.caesarjlee.caesarfinancialtracker.controllers;

import com.caesarjlee.caesarfinancialtracker.dtos.CategoryRequest;
import com.caesarjlee.caesarfinancialtracker.dtos.CategoryResponse;
import com.caesarjlee.caesarfinancialtracker.dtos.ImportResponse;
import com.caesarjlee.caesarfinancialtracker.services.CategoryService;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/categories")
public class CategoryController {
    private final CategoryService categoryService;

    @PostMapping
    public ResponseEntity<CategoryResponse> create(@RequestBody @Valid CategoryRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(categoryService.create(request));
    }

    @GetMapping
    public ResponseEntity<Page<CategoryResponse>>
    read(@RequestParam(defaultValue = "all") String type, @RequestParam(required = false) String name,
         @RequestParam(defaultValue = "CREATED_DESCENDING") String order, @RequestParam(defaultValue = "0") int page,
         @RequestParam(defaultValue = "30") int size) {
        return ResponseEntity.ok(categoryService.read(type, name, order, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity <CategoryResponse> fetch(@PathVariable Long id){
        return ResponseEntity.ok(categoryService.fetch(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryResponse> update(@PathVariable Long id, @RequestBody @Valid CategoryRequest request) {
        return ResponseEntity.ok(categoryService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        categoryService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/import")
    public ResponseEntity<ImportResponse> importCategories(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(categoryService.importCategories(file));
    }

    @GetMapping("/export/{type}")
    public ResponseEntity<byte []> export(@PathVariable String type) {
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=categories." + type)
            .body(categoryService.export(type));
    }
}
