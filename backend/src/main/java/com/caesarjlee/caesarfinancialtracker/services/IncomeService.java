package com.caesarjlee.caesarfinancialtracker.services;

import com.caesarjlee.caesarfinancialtracker.dtos.ImportResponse;
import com.caesarjlee.caesarfinancialtracker.dtos.IncomeRequest;
import com.caesarjlee.caesarfinancialtracker.dtos.IncomeResponse;
import com.caesarjlee.caesarfinancialtracker.entities.CategoryEntity;
import com.caesarjlee.caesarfinancialtracker.entities.IncomeEntity;
import com.caesarjlee.caesarfinancialtracker.entities.ProfileEntity;
import com.caesarjlee.caesarfinancialtracker.enumerations.CategoryType;
import com.caesarjlee.caesarfinancialtracker.enumerations.RecordOrders;
import com.caesarjlee.caesarfinancialtracker.exceptions.categories.CategoryNotFoundException;
import com.caesarjlee.caesarfinancialtracker.exceptions.incomes.IncomeDateException;
import com.caesarjlee.caesarfinancialtracker.exceptions.incomes.IncomeNotFoundException;
import com.caesarjlee.caesarfinancialtracker.exceptions.incomes.IncomeOrderNotFoundException;
import com.caesarjlee.caesarfinancialtracker.exceptions.incomes.IncomePriceException;
import com.caesarjlee.caesarfinancialtracker.exceptions.pages.PageSizeException;
import com.caesarjlee.caesarfinancialtracker.repositories.CategoryRepository;
import com.caesarjlee.caesarfinancialtracker.repositories.IncomeRepository;
import com.caesarjlee.caesarfinancialtracker.utilities.ExportFiles;
import com.caesarjlee.caesarfinancialtracker.utilities.ImportFiles;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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
    private final ImportFiles        importFiles;
    private final ExportFiles        exportFiles;

    private IncomeResponse           toResponse(IncomeEntity entity) {
        return new IncomeResponse(entity.getId(), entity.getName(), entity.getIcon(), entity.getDate(),
                                            entity.getPrice(), entity.getDescription(), entity.getCreatedAt(),
                                            entity.getUpdatedAt(), entity.getCategory().getName());
    }

    private RecordOrders validOrder(String order) {
        RecordOrders validOrder;
        try {
            validOrder = RecordOrders.valueOf(order.toUpperCase());
        } catch(Exception e) {
            throw new IncomeOrderNotFoundException(order);
        }
        return validOrder;
    }

    private Pageable validPage(String order, int page, int size) {
        if(size < 1 || size > 120)
            throw new PageSizeException("page size must be [1, 120]");
        return PageRequest.of(page, size, validOrder(order).getSort());
    }

    private void validate(LocalDate start, LocalDate end, BigDecimal low, BigDecimal high) {
        // dates
        if(end != null && end.isAfter(LocalDate.now()))
            throw new IncomeDateException(end.toString() + " must be <= " + LocalDate.now().toString());
        if(start != null && end != null && start.isAfter(end))
            throw new IncomeDateException(start.toString() + " must be <= " + end.toString());
        // prices
        if(low != null && low.compareTo(BigDecimal.ZERO) < 0)
            throw new IncomePriceException(low.toString() + " must be >= 0");
        if(high != null && high.compareTo(BigDecimal.ZERO) < 0)
            throw new IncomePriceException(high.toString() + " must be >= 0");
        if(low != null && high != null && low.compareTo(high) > 0)
            throw new IncomePriceException(low.toString() + " must be <= " + high.toString());
    }

    public IncomeResponse create(IncomeRequest request) {
        Long           profileId = profileService.getCurrentProfile().getId();

        CategoryEntity category =
            categoryRepository.findByIdAndProfileId(request.categoryId(), profileId)
                .orElseThrow(() -> new CategoryNotFoundException(Long.toString(request.categoryId())));
        return toResponse(incomeRepository.save(IncomeEntity.builder()
                                                    .name(request.name())
                                                    .icon(request.icon())
                                                    .date(request.date())
                                                    .price(request.price())
                                                    .description(request.description())
                                                    .category(category)
                                                    .profile(profileService.getCurrentProfile())
                                                    .build()));
    }

    public Page<IncomeResponse> read(String order, String keyword, Long categoryId, LocalDate dateStart,
                                     LocalDate dateEnd, BigDecimal priceLow, BigDecimal priceHigh, int page, int size) {
        validate(dateStart, dateEnd, priceLow, priceHigh);
        return incomeRepository
            .search(profileService.getCurrentProfile().getId(), keyword, categoryId, dateStart, dateEnd, priceLow,
                    priceHigh, validPage(order, page, size))
            .map(this::toResponse);
    }

    public IncomeResponse update(Long id, IncomeRequest request) {
        IncomeEntity entity = incomeRepository.findByIdAndProfileId(id, profileService.getCurrentProfile().getId())
                                  .orElseThrow(() -> new IncomeNotFoundException(request.name()));
        CategoryEntity category =
            categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new CategoryNotFoundException(Long.toString(request.categoryId())));
        entity.setName(request.name());
        entity.setIcon(request.icon());
        entity.setDate(request.date());
        entity.setPrice(request.price());
        entity.setDescription(request.description());
        entity.setCategory(category);
        return toResponse(incomeRepository.save(entity));
    }

    public void delete(Long id) {
        incomeRepository.delete(incomeRepository.findByIdAndProfileId(id, profileService.getCurrentProfile().getId())
                                    .orElseThrow(() -> new IncomeNotFoundException(Long.toString(id))));
    }

    public ImportResponse importIncome(MultipartFile file) {
        return importFiles.importData(file, new IncomeEntity());
    }

    public byte [] export(String type) {
        return exportFiles.exportData(type, new IncomeEntity());
    }
}
