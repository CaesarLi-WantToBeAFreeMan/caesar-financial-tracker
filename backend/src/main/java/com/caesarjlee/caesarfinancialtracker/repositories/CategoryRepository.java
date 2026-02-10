package com.caesarjlee.caesarfinancialtracker.repositories;

import com.caesarjlee.caesarfinancialtracker.entities.CategoryEntity;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface CategoryRepository extends JpaRepository<CategoryEntity, Long> {
    Optional<CategoryEntity> findByIdAndProfileId(Long id, Long profileId);
    boolean                  existsByNameAndTypeAndProfileId(String name, String type, Long profileId);
    Page<CategoryEntity>     findByProfileId(Long profileId, Pageable pageable);
    Page<CategoryEntity>     findByTypeAndProfileId(String type, Long profileId, Pageable pageable);
    @Query("""
        SELECT c
        FROM CategoryEntity c
        WHERE c.profile.id = :profileId
            AND (:type IS NULL OR c.type = :type)
            AND (:name IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', :name, '%')))
    """)
    Page<CategoryEntity> search(@Param("profileId") Long profileId, @Param("type") String type,
                                @Param("name") String name, Pageable pageable);
}
