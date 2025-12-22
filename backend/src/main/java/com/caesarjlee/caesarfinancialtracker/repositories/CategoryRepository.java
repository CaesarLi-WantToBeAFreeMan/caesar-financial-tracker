package com.caesarjlee.caesarfinancialtracker.repositories;

import com.caesarjlee.caesarfinancialtracker.entities.CategoryEntity;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<CategoryEntity, Long> {
    List<CategoryEntity>     findByProfileId(Long profileId);
    Optional<CategoryEntity> findByIdAndProfileId(Long id, Long profileId);
    List<CategoryEntity>     findAllByTypeAndProfileId(String type, Long profileId);
    boolean                  existsByNameAndTypeAndProfileId(String name, String type, Long profileId);
}
