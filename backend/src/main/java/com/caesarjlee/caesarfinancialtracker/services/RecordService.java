package com.caesarjlee.caesarfinancialtracker.services;

import com.caesarjlee.caesarfinancialtracker.dtos.records.*;
import com.caesarjlee.caesarfinancialtracker.dtos.ImportResponse;
import com.caesarjlee.caesarfinancialtracker.entities.*;
import com.caesarjlee.caesarfinancialtracker.enumerations.*;
import com.caesarjlee.caesarfinancialtracker.exceptions.categories.CategoryNotFoundException;
import com.caesarjlee.caesarfinancialtracker.exceptions.records.*;
import com.caesarjlee.caesarfinancialtracker.exceptions.pages.PageSizeException;
import com.caesarjlee.caesarfinancialtracker.repositories.*;
import com.caesarjlee.caesarfinancialtracker.utilities.*;

import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RecordService {
    private final ProfileService     profileService;
    private final CategoryRepository categoryRepository;
    private final RecordRepository   recordRepository;
    private final ImportFiles        importFiles;
    private final ExportFiles        exportFiles;

    private RecordResponse           toResponse(RecordEntity entity) {
        return new RecordResponse(entity.getId(), entity.getName(), entity.getType(), entity.getIcon(), entity.getDate(),
                                            entity.getPrice(), entity.getDescription(), entity.getCreatedAt(),
                                            entity.getUpdatedAt(), entity.getCategory().getId());
    }

    private RecordOrders validOrder(String order) {
        RecordOrders validOrder;
        try {
            validOrder = RecordOrders.valueOf(order.toUpperCase());
        } catch(Exception e) {
            throw new RecordOrderNotFoundException(order);
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
            throw new InvalidRecordDateException(end.toString() + " must be <= " + LocalDate.now().toString());
        if(start != null && end != null && start.isAfter(end))
            throw new InvalidRecordDateException(start.toString() + " must be <= " + end.toString());
        // prices
        if(low != null && low.compareTo(BigDecimal.ZERO) < 0)
            throw new InvalidRecordPriceException(low.toString() + " must be >= 0");
        if(high != null && high.compareTo(BigDecimal.ZERO) < 0)
            throw new InvalidRecordPriceException(high.toString() + " must be >= 0");
        if(low != null && high != null && low.compareTo(high) > 0)
            throw new InvalidRecordPriceException(low.toString() + " must be <= " + high.toString());
    }

    public RecordResponse create(RecordRequest request) {
        Long           profileId = profileService.getCurrentProfile().getId();
        CategoryEntity category =
            categoryRepository.findByIdAndProfileId(request.categoryId(), profileId)
                .orElseThrow(() -> new CategoryNotFoundException(Long.toString(request.categoryId())));
        return toResponse(recordRepository.save(
            RecordEntity.builder()
                .name(request.name())
                .type(request.type())
                .icon(request.icon())
                .date(request.date() == null ? LocalDate.now() : request.date())
                .price(request.price() == null ? BigDecimal.ZERO : request.price())
                .description(request.description() == null || request.description().isBlank() ? request.name()
                                                                                              : request.description())
                .category(category)
                .profile(profileService.getCurrentProfile())
                .build()));
    }

    public Page<RecordResponse> read(String order, String type, String keyword, Long categoryId, LocalDate dateStart,
                                     LocalDate dateEnd, BigDecimal priceLow, BigDecimal priceHigh, int page, int size) {
        validate(dateStart, dateEnd, priceLow, priceHigh);
        return recordRepository
            .search(profileService.getCurrentProfile().getId(), keyword, type, categoryId, dateStart, dateEnd, priceLow,
                    priceHigh, validPage(order, page, size))
            .map(this::toResponse);
    }

    public RecordResponse update(Long id, RecordRequest request) {
        RecordEntity entity = recordRepository.findByIdAndProfileId(id, profileService.getCurrentProfile().getId())
                                  .orElseThrow(() -> new RecordNotFoundException(request.name()));
        entity.setName(request.name());
        entity.setType(request.type() == null ? entity.getType() : request.type());
        entity.setIcon(request.icon() == null ? entity.getIcon() : request.icon());
        entity.setDate(request.date() == null ? entity.getDate() : request.date());
        entity.setPrice(request.price() == null ? entity.getPrice() : request.price());
        entity.setDescription(request.description() == null ? request.name() : request.description());
        entity.setCategory(
            request.categoryId() == null
                ? entity.getCategory()
                : categoryRepository.findById(request.categoryId())
                      .orElseThrow(() -> new CategoryNotFoundException(Long.toString(request.categoryId()))));
        return toResponse(recordRepository.save(entity));
    }

    public void delete(Long id) {
        recordRepository.delete(recordRepository.findByIdAndProfileId(id, profileService.getCurrentProfile().getId())
                                    .orElseThrow(() -> new RecordNotFoundException(Long.toString(id))));
    }

    public ImportResponse importRecord(MultipartFile file) {
        return importFiles.importData(file, new RecordEntity());
    }

    public byte [] export(String type) {
        return exportFiles.exportData(type, new RecordEntity());
    }
}
