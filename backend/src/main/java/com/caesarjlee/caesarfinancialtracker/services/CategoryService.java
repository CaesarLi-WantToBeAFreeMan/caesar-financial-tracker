package com.caesarjlee.caesarfinancialtracker.services;

import com.caesarjlee.caesarfinancialtracker.dtos.CategoryRequest;
import com.caesarjlee.caesarfinancialtracker.dtos.CategoryResponse;
import com.caesarjlee.caesarfinancialtracker.entities.CategoryEntity;
import com.caesarjlee.caesarfinancialtracker.entities.ProfileEntity;
import com.caesarjlee.caesarfinancialtracker.repositories.CategoryRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final ProfileService     profileService;

    private CategoryResponse         toResponse(CategoryEntity entity) {
        return new CategoryResponse(entity.getName(), entity.getType(), entity.getIcon(), entity.getCreatedAt(),
                                            entity.getUpdatedAt());
    }

    public CategoryResponse createCategory(CategoryRequest request) {
        ProfileEntity profile = profileService.getCurrentProfile();
        if(categoryRepository.existsByNameAndTypeAndProfileId(request.name(), request.type(), profile.getId()))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Category already exists");
        CategoryEntity entity = CategoryEntity.builder()
                                    .name(request.name())
                                    .type(request.type())
                                    .icon(request.icon())
                                    .profile(profile)
                                    .build();
        entity = categoryRepository.save(entity);
        return toResponse(entity);
    }

    public List<CategoryResponse> getAllCategories() {
        ProfileEntity profile = profileService.getCurrentProfile();
        return categoryRepository.findByProfileId(profile.getId()).stream().map(this::toResponse).toList();
    }

    public List<CategoryResponse> getCategoriesByType(String type) {
        ProfileEntity profile = profileService.getCurrentProfile();
        return categoryRepository.findAllByTypeAndProfileId(type, profile.getId())
            .stream()
            .map(this::toResponse)
            .toList();
    }

    public CategoryResponse updateCategory(Long id, CategoryRequest request) {
        ProfileEntity  profile = profileService.getCurrentProfile();
        CategoryEntity entity =
            categoryRepository.findByIdAndProfileId(id, profile.getId())
                .orElseThrow(
                    () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found or not owned by user"));
        entity.setName(request.name());
        entity.setType(request.type());
        entity.setIcon(request.icon());
        entity = categoryRepository.save(entity);
        return toResponse(entity);
    }
}
