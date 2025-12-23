package com.caesarjlee.caesarfinancialtracker.services;

import com.caesarjlee.caesarfinancialtracker.dtos.IncomeRequest;
import com.caesarjlee.caesarfinancialtracker.dtos.IncomeResponse;
import com.caesarjlee.caesarfinancialtracker.entities.CategoryEntity;
import com.caesarjlee.caesarfinancialtracker.entities.IncomeEntity;
import com.caesarjlee.caesarfinancialtracker.entities.ProfileEntity;
import com.caesarjlee.caesarfinancialtracker.repositories.CategoryRepository;
import com.caesarjlee.caesarfinancialtracker.repositories.IncomeRepository;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class IncomeService {
    private final ProfileService     profileService;
    private final CategoryRepository categoryRepository;
    private final IncomeRepository   incomeRepository;

    private IncomeResponse           toResponse(IncomeEntity entity) {
        return new IncomeResponse(entity.getId(), entity.getName(), entity.getIcon(), entity.getDate(),
                                            entity.getPrice(), entity.getDescription(), entity.getCreatedAt(),
                                            entity.getUpdatedAt(), entity.getCategory().getName());
    }

    public IncomeResponse addIncome(IncomeRequest request) {
        ProfileEntity  profile  = profileService.getCurrentProfile();
        CategoryEntity category = categoryRepository.findById(request.categoryId())
                                      .orElseThrow(() -> new RuntimeException("Category not found"));
        IncomeEntity newIncome = IncomeEntity.builder()
                                     .name(request.name())
                                     .icon(request.icon())
                                     .date(request.date() != null ? request.date() : LocalDate.now())
                                     .price(request.price())
                                     .description(request.description())
                                     .category(category)
                                     .profile(profile)
                                     .build();
        newIncome = incomeRepository.save(newIncome);
        return toResponse(newIncome);
    }

    public List<IncomeResponse> getCurrentMonthIncomes() {
        ProfileEntity profile = profileService.getCurrentProfile();
        LocalDate     now = LocalDate.now(), startDate = now.withDayOfMonth(1),
                  endDate       = now.withDayOfMonth(now.lengthOfMonth());
        List<IncomeEntity> list = incomeRepository.findByProfileIdAndDateBetween(profile.getId(), startDate, endDate);
        return list.stream().map(this::toResponse).toList();
    }

    public void deleteIncomeById(Long id) {
        ProfileEntity profile = profileService.getCurrentProfile();
        IncomeEntity income = incomeRepository.findById(id).orElseThrow(() -> new RuntimeException("Income not found"));
        if(!income.getProfile().getId().equals(profile.getId()))
            throw new RuntimeException("Unauthorized to delete this income");
        incomeRepository.delete(income);
    }

    public List<IncomeResponse> getLatest5Incomes() {
        ProfileEntity      profile = profileService.getCurrentProfile();
        List<IncomeEntity> list    = incomeRepository.findTop5ByProfileIdOrderByDateDesc(profile.getId());
        return list.stream().map(this::toResponse).toList();
    }

    public BigDecimal getTotalIncomes() {
        ProfileEntity profile = profileService.getCurrentProfile();
        return incomeRepository.findTotalIncomeByProfileId(profile.getId());
    }
}
