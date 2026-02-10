package com.caesarjlee.caesarfinancialtracker.services;

import com.caesarjlee.caesarfinancialtracker.dtos.CategoryRequest;
import com.caesarjlee.caesarfinancialtracker.dtos.CategoryResponse;
import com.caesarjlee.caesarfinancialtracker.dtos.ImportResponse;
import com.caesarjlee.caesarfinancialtracker.entities.CategoryEntity;
import com.caesarjlee.caesarfinancialtracker.entities.ProfileEntity;
import com.caesarjlee.caesarfinancialtracker.enumerations.CategoryOrders;
import com.caesarjlee.caesarfinancialtracker.enumerations.CategoryType;
import com.caesarjlee.caesarfinancialtracker.exceptions.categories.CategoryAlreadyExistException;
import com.caesarjlee.caesarfinancialtracker.exceptions.categories.CategoryInUseException;
import com.caesarjlee.caesarfinancialtracker.exceptions.categories.CategoryNotFoundException;
import com.caesarjlee.caesarfinancialtracker.exceptions.categories.CategoryOrderNotFoundException;
import com.caesarjlee.caesarfinancialtracker.exceptions.categories.CategoryTypeNotFoundException;
import com.caesarjlee.caesarfinancialtracker.exceptions.pages.PageSizeException;
import com.caesarjlee.caesarfinancialtracker.repositories.CategoryRepository;
import com.caesarjlee.caesarfinancialtracker.utilities.ExportFiles;
import com.caesarjlee.caesarfinancialtracker.utilities.ImportFiles;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final ProfileService     profileService;
    private final ImportFiles        importFiles;
    private final ExportFiles        exportFiles;

    private CategoryResponse         toResponse(CategoryEntity entity) {
        return new CategoryResponse(entity.getId(), entity.getName(), entity.getType(), entity.getIcon(),
                                            entity.getCreatedAt(), entity.getUpdatedAt());
    }

    private CategoryType validType(String type) {
        CategoryType validType;
        try {
            validType = CategoryType.from(type);
        } catch(Exception e) {
            throw new CategoryTypeNotFoundException(type);
        }
        return validType;
    }

    private CategoryOrders validOrder(String order) {
        CategoryOrders validOrder;
        try {
            validOrder = CategoryOrders.valueOf(order.toUpperCase());
        } catch(Exception e) {
            throw new CategoryOrderNotFoundException(order);
        }
        return validOrder;
    }

    public CategoryResponse createCategory(CategoryRequest request) {
        ProfileEntity profile = profileService.getCurrentProfile();
        if(categoryRepository.existsByNameAndTypeAndProfileId(request.name(), request.type(), profile.getId()))
            throw new CategoryAlreadyExistException(request.name());
        CategoryEntity entity = CategoryEntity.builder()
                                    .name(request.name())
                                    .type(request.type())
                                    .icon(request.icon())
                                    .profile(profile)
                                    .build();
        entity = categoryRepository.save(entity);
        return toResponse(entity);
    }

    public Page<CategoryResponse> getCategoriesByTypeAndOrder(String type, String order, int page, int size) {
        if(size < 1 || size > 120)
            throw new PageSizeException("page size must be [1, 120]");
        Long                 profileId = profileService.getCurrentProfile().getId();
        Pageable             pageable  = PageRequest.of(page, size, validOrder(order).getSort());
        CategoryType         validType = validType(type);
        Page<CategoryEntity> categories =
            validType == CategoryType.ALL
                ? categoryRepository.findByProfileId(profileId, pageable)
                : categoryRepository.findByTypeAndProfileId(validType.name(), profileId, pageable);
        return categories.map(this::toResponse);
    }

    public CategoryResponse updateCategory(Long id, CategoryRequest request) {
        ProfileEntity  profile = profileService.getCurrentProfile();
        CategoryEntity entity  = categoryRepository.findByIdAndProfileId(id, profile.getId())
                                    .orElseThrow(() -> new CategoryNotFoundException(request.name()));
        entity.setName(request.name());
        entity.setType(request.type());
        entity.setIcon(request.icon());
        entity = categoryRepository.save(entity);
        return toResponse(entity);
    }

    public void deleteCategory(Long id) {
        ProfileEntity  profile  = profileService.getCurrentProfile();
        CategoryEntity category = categoryRepository.findByIdAndProfileId(id, profile.getId())
                                      .orElseThrow(() -> new CategoryNotFoundException("id = " + id));

        try {
            categoryRepository.delete(category);
        } catch(DataIntegrityViolationException e) {
            throw new CategoryInUseException(id);
        }
    }

    public ImportResponse importCategories(MultipartFile file) {
        return importFiles.importData(file, new CategoryEntity());
    }

    public byte [] exportCategories(String type) {
        return exportFiles.exportData(type, new CategoryEntity());
    }

    public Page<CategoryResponse> searchCategories(String type, String name, String order, int page, int size) {
        if(size < 1 || size > 120)
            throw new PageSizeException("page size must be [1, 120]");
        Long                 profileId = profileService.getCurrentProfile().getId();
        Pageable             pageable  = PageRequest.of(page, size, validOrder(order).getSort());
        CategoryType         validType = validType(type);
        Page<CategoryEntity> categories =
            validType == CategoryType.ALL
                ? categoryRepository.findByProfileIdAndName(profileId, name, pageable)
                : categoryRepository.findByProfileIdAndTypeAndName(profileId, validType.name(), name, pageable);
        return categories.map(this::toResponse);
    }
}
