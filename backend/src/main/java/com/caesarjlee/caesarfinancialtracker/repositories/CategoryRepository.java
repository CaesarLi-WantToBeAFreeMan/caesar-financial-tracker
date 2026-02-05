package com.caesarjlee.caesarfinancialtracker.repositories;

import com.caesarjlee.caesarfinancialtracker.entities.CategoryEntity;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<CategoryEntity, Long> {
    List<CategoryEntity>     findByProfileId(Long profileId);
    Page<CategoryEntity>     findByProfileId(Long profileId, Pageable pageable);
    Optional<CategoryEntity> findByIdAndProfileId(Long id, Long profileId);
    List<CategoryEntity>     findAllByTypeAndProfileId(String type, Long profileId);
    Page<CategoryEntity>     findByTypeAndProfileId(String type, Long profileId, Pageable pageable);
    boolean                  existsByNameAndTypeAndProfileId(String name, String type, Long profileId);
}
