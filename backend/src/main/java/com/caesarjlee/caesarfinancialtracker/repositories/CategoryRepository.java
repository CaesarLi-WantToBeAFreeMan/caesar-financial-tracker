package com.caesarjlee.caesarfinancialtracker.repositories;

import com.caesarjlee.caesarfinancialtracker.entities.CategoryEntity;

import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.*;

public interface CategoryRepository extends JpaRepository<CategoryEntity, Long> {
    /*
        SELECT * FROM cft_categories
            WHERE id = ? AND profile_id = ?
    */
    Optional <CategoryEntity> findByIdAndProfileId(Long id, Long profileId);
    /*
        SELECT EXISTS(
            SELECT 1 FROM cft_categories
                WHERE name = ? AND type = ? AND profile_id = ?
        )
    */
    boolean                   existsByNameAndTypeAndProfileId(String name, String type, Long profileId);
    /*
        SELECT * FROM cft_categories
            WHERE profile_id = ?
    */
    List <CategoryEntity>     findByProfileId(Long profileId);
    /*
        SELECT * FROM cft_categories
            WHERE profile_id = ?
            ORDER BY ? ASC/DESC
            LIMIT ? OFFSET ?
    */
    Page <CategoryEntity>     findByProfileId(Long profileId, Pageable pageable);
    /*
        SELECT * FROM cft_categories
        WHERE type = ? AND profile_id = ?
        ORDER BY ? ASC/DESC
        LIMIT ? OFFSET ?
    */
    Page <CategoryEntity>     findByTypeAndProfileId(String type, Long profileId, Pageable pageable);
    /*
        SELECT * FROM cft_categories
            WHERE profile_id = ?
                AND (? IS NULL OR type = ?)
                AND (? IS NULL OR LOWER(name) LIKE LOWER(CONCAT('%', ?, '%')))
            ORDER BY ? ASC/DESC
            LIMIT ? OFFSET ?
    */
    @Query(
        """
            SELECT c FROM CategoryEntity c
                WHERE c.profile.id = :profileId
                    AND (:type IS NULL OR c.type = :type)
                    AND (:name IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', :name, '%')))
        """
    )
    Page <CategoryEntity>     search(@Param("profileId") Long profileId, @Param("type") String type,
                                     @Param("keyword") String keyword, Pageable pageable);
}
