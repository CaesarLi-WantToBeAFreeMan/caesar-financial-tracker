package com.caesarjlee.caesarfinancialtracker.repositories;

import com.caesarjlee.caesarfinancialtracker.entities.CategoryEntity;

import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.*;

public interface CategoryRepository extends JpaRepository<CategoryEntity, Long> {
    Optional<CategoryEntity> findByIdAndProfileId(Long id, Long profileId);
    boolean                  existsByNameAndTypeAndProfileId(String name, String type, Long profileId);
    List<CategoryEntity>     findByProfileId(Long profileId);
    Page<CategoryEntity>     findByProfileId(Long profileId, Pageable pageable);
    Page<CategoryEntity>     findByTypeAndProfileId(String type, Long profileId, Pageable pageable);
    @Query(
        value = """
            SELECT * FROM cft_categories c
            WHERE c.profile_id = :profileId
                AND (:type      IS NULL OR LOWER(c.type)    =       :type)
                AND (:keyword   IS NULL OR LOWER(c.name)    LIKE    :keyword)
        """,
        countQuery = """
            SELECT COUNT(*) FROM cft_categories c
            WHERE c.profile_id = :profileId
                AND (:type      IS NULL OR LOWER(c.type)    =       :type)
                AND (:keyword   IS NULL OR LOWER(c.name)    LIKE    :keyword)
        """,
        nativeQuery = true
    )
    Page<CategoryEntity> search(@Param("profileId") Long profileId, @Param("type") String type,
                                @Param("keyword") String keyword, Pageable pageable);
}
