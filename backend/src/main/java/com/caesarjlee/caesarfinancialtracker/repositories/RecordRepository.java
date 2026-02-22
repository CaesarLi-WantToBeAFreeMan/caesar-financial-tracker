package com.caesarjlee.caesarfinancialtracker.repositories;

import com.caesarjlee.caesarfinancialtracker.entities.RecordEntity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

public interface RecordRepository extends JpaRepository <RecordEntity, Long> {
    Optional <RecordEntity> findByIdAndProfileId(Long id, Long profileId);
    List <RecordEntity> findByProfileId(Long profileId);
    @Query("""
        SELECT r
        FROM RecordEntity r
        WHERE r.profile.id = :profileId
            AND (:keyword IS NULL OR LOWER(r.name) LIKE LOWER(CONCAT('%', :keyword, '%')))
            AND (:type IS NULL OR :type = 'all' OR LOWER(r.category.type) = LOWER(:type))
            AND (:categoryId IS NULL OR r.category.id = :categoryId)
            AND (:dateStart IS NULL OR r.date >= :dateStart)
            AND (:dateEnd IS NULL OR r.date <= :dateEnd)
            AND (:priceLow IS NULL OR r.price >= :priceLow)
            AND (:priceHigh IS NULL OR r.price <= :priceHigh)
    """)
    Page<RecordEntity> search(@Param("profileId") Long profileId, @Param("keyword") String keyword, @Param("type") String type,
                              @Param("categoryId") Long categoryId, @Param("dateStart") LocalDate dateStart,
                              @Param("dateEnd") LocalDate dateEnd, @Param("priceLow") BigDecimal priceLow,
                              @Param("priceHigh") BigDecimal priceHigh, Pageable pageable);
}
