package com.caesarjlee.caesarfinancialtracker.services;

import com.caesarjlee.caesarfinancialtracker.dtos.categories.*;
import com.caesarjlee.caesarfinancialtracker.dtos.imports.ImportResponse;
import com.caesarjlee.caesarfinancialtracker.entities.*;
import com.caesarjlee.caesarfinancialtracker.enumerations.*;
import com.caesarjlee.caesarfinancialtracker.exceptions.categories.*;
import com.caesarjlee.caesarfinancialtracker.exceptions.pages.PageSizeException;
import com.caesarjlee.caesarfinancialtracker.repositories.CategoryRepository;
import com.caesarjlee.caesarfinancialtracker.utilities.*;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final ProfileService     profileService;
    private final ImportFiles        importFiles;
    private final ExportFiles        exportFiles;

    //validations
    private CategoryResponse         toResponse(CategoryEntity entity) {
        return new CategoryResponse(entity.getId(), entity.getName(), entity.getType(), entity.getIcon(),
                                    entity.getCreatedAt(), entity.getUpdatedAt());
    }

    private CategoryType validType(String type) {
        try {
            return CategoryType.from(type);
        } catch(Exception e) {
            throw new CategoryTypeNotFoundException(type);
        }
    }

    private Pageable validPage(String order, int page, int size) {
        if(size < 1 || size > 120)
            throw new PageSizeException("page size must be between 1 and 120");
        try{
            CategoryOrders categoryOrders = CategoryOrders.valueOf(order.toUpperCase());
            return PageRequest.of(page, size, categoryOrders.getSort());
        }catch(IllegalArgumentException e){
            throw new CategoryOrderNotFoundException(order);
        }
    }

    private static String toKeyword(String keyword){
        return keyword == null || keyword.isBlank() ? null : "%" + keyword.toLowerCase() + "%";
    }

    private static String toType(String type){
        return type == null || "all".equalsIgnoreCase(type) ? null : type.toLowerCase();
    }

    //curd
    public CategoryResponse create(CategoryRequest request) {
        ProfileEntity profile = profileService.getCurrentProfile();
        if(categoryRepository.existsByNameAndTypeAndProfileId(request.name(), request.type(), profile.getId()))
            throw new CategoryAlreadyExistException(request.name());
        return toResponse(categoryRepository.save(CategoryEntity.builder()
                                                                .name(request.name())
                                                                .type(request.type())
                                                                .icon(request.icon())
                                                                .profile(profile)
                                                                .build()));
    }

    public Page<CategoryResponse> read(String type, String keyword, String order, int page, int size) {
        Long         profileId = profileService.getCurrentProfile().getId();
        Pageable     pageable  = validPage(order, page, size);
        CategoryType validType = validType(type);
        String       typeName  = validType == CategoryType.ALL ? null : validType.name();
        return categoryRepository.search(profileId, toType(typeName), toKeyword(keyword), pageable).map(this::toResponse);
    }

    public CategoryResponse fetch(Long id){
        Long profileId = profileService.getCurrentProfile().getId();
        return toResponse(categoryRepository.findByIdAndProfileId(id, profileId)
                                            .orElseThrow(() -> new CategoryNotFoundException("id = " + id)));
    }

    public CategoryResponse update(Long id, CategoryRequest request) {
        Long profileId = profileService.getCurrentProfile().getId();
        CategoryEntity entity = categoryRepository.findByIdAndProfileId(id, profileId)
                                                .orElseThrow(() -> new CategoryNotFoundException(request.name()));
        entity.setName(request.name());
        entity.setType(request.type());
        if(request.icon() != null && !request.icon().equals(entity.getIcon()))
            entity.setIcon(request.icon());
        return toResponse(categoryRepository.save(entity));
    }

    public void delete(Long id) {
        ProfileEntity  profile  = profileService.getCurrentProfile();
        CategoryEntity category = categoryRepository.findByIdAndProfileId(id, profile.getId())
                                                    .orElseThrow(() -> new CategoryNotFoundException("id = " + id));
        try {
            categoryRepository.delete(category);
        } catch(DataIntegrityViolationException e) {
            throw new CategoryInUseException(id);
        }
    }

    //import and export
    public ImportResponse importCategories(MultipartFile file) {
        return importFiles.importData(file, new CategoryEntity());
    }

    public byte [] export(String type) {
        return exportFiles.exportData(type, new CategoryEntity());
    }
}
