package com.caesarjlee.caesarfinancialtracker.services;

import com.caesarjlee.caesarfinancialtracker.dtos.ExpenseRequest;
import com.caesarjlee.caesarfinancialtracker.dtos.ExpenseResponse;
import com.caesarjlee.caesarfinancialtracker.entities.CategoryEntity;
import com.caesarjlee.caesarfinancialtracker.entities.ExpenseEntity;
import com.caesarjlee.caesarfinancialtracker.entities.ProfileEntity;
import com.caesarjlee.caesarfinancialtracker.repositories.CategoryRepository;
import com.caesarjlee.caesarfinancialtracker.repositories.ExpenseRepository;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExpenseService {
    private final ProfileService     profileService;
    private final CategoryRepository categoryRepository;
    private final ExpenseRepository  expenseRepository;

    private ExpenseResponse          toResponse(ExpenseEntity entity) {
        return new ExpenseResponse(entity.getId(), entity.getName(), entity.getIcon(), entity.getDate(),
                                            entity.getPrice(), entity.getDescription(), entity.getCreatedAt(),
                                            entity.getUpdatedAt(), entity.getCategory().getName());
    }

    public ExpenseResponse addExpense(ExpenseRequest request) {
        ProfileEntity  profile  = profileService.getCurrentProfile();
        CategoryEntity category = categoryRepository.findById(request.categoryId())
                                      .orElseThrow(() -> new RuntimeException("Category not found"));
        ExpenseEntity newExpense = ExpenseEntity.builder()
                                       .name(request.name())
                                       .icon(request.icon())
                                       .date(request.date() != null ? request.date() : LocalDate.now())
                                       .price(request.price())
                                       .description(request.description())
                                       .category(category)
                                       .profile(profile)
                                       .build();
        newExpense = expenseRepository.save(newExpense);
        return toResponse(newExpense);
    }

    public List<ExpenseResponse> getCurrentMonthExpenses() {
        ProfileEntity profile = profileService.getCurrentProfile();
        LocalDate     now = LocalDate.now(), startDate = now.withDayOfMonth(1),
                  endDate        = now.withDayOfMonth(now.lengthOfMonth());
        List<ExpenseEntity> list = expenseRepository.findByProfileIdAndDateBetween(profile.getId(), startDate, endDate);
        return list.stream().map(this::toResponse).toList();
    }

    public void deleteExpenseById(Long id) {
        ProfileEntity profile = profileService.getCurrentProfile();
        ExpenseEntity expense =
            expenseRepository.findById(id).orElseThrow(() -> new RuntimeException("Expense not found"));
        if(!expense.getProfile().getId().equals(profile.getId()))
            throw new RuntimeException("Unauthorized to delete this expense");
        expenseRepository.delete(expense);
    }

    public List<ExpenseResponse> getLatest5Expenses() {
        ProfileEntity       profile = profileService.getCurrentProfile();
        List<ExpenseEntity> list    = expenseRepository.findTop5ByProfileIdOrderByDateDesc(profile.getId());
        return list.stream().map(this::toResponse).toList();
    }

    public BigDecimal getTotalExpenses() {
        ProfileEntity profile = profileService.getCurrentProfile();
        return expenseRepository.findTotalExpenseByProfileId(profile.getId());
    }
}
