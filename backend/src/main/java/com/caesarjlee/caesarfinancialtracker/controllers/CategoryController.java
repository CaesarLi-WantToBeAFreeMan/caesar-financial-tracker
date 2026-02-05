package com.caesarjlee.caesarfinancialtracker.controllers;

import com.caesarjlee.caesarfinancialtracker.dtos.CategoryRequest;
import com.caesarjlee.caesarfinancialtracker.dtos.CategoryResponse;
import com.caesarjlee.caesarfinancialtracker.enumerations.CategoryOrders;
import com.caesarjlee.caesarfinancialtracker.exceptions.categories.CategoryOrderNotFoundException;
import com.caesarjlee.caesarfinancialtracker.services.CategoryService;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/categories")
public class CategoryController {
    private final CategoryService categoryService;

    @PostMapping
    public ResponseEntity<CategoryResponse> createCategory(@Valid @RequestBody CategoryRequest request) {
        CategoryResponse response = categoryService.createCategory(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/filter")
    public ResponseEntity<Page<CategoryResponse>>
    getCategoriesByTypeAndOrder(@RequestParam(defaultValue = "all") String                type,
                                @RequestParam(defaultValue = "CREATED_DESCENDING") String order,
                                @RequestParam(defaultValue = "0") int                     page,
                                @RequestParam(defaultValue = "30") int                    size) {
        CategoryOrders validOrder;
        try {
            validOrder = CategoryOrders.valueOf(order.toUpperCase());
        } catch(Exception e) {
            throw new CategoryOrderNotFoundException(order);
        }
        return ResponseEntity.ok(categoryService.getCategoriesByTypeAndOrder(type, validOrder, page, size));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryResponse> updateCategory(@PathVariable Long                  id,
                                                           @Valid @RequestBody CategoryRequest request) {
        CategoryResponse updated = categoryService.updateCategory(id, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}
