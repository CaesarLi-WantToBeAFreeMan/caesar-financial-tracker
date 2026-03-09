package com.caesarjlee.caesarfinancialtracker.repositories;

import com.caesarjlee.caesarfinancialtracker.entities.RecordEntity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

public interface RecordRepository extends JpaRepository <RecordEntity, Long> {
    /*
        SELECT * FROM cft_records
            WHERE id = ? AND profile_id = ?
    */
    Optional <RecordEntity> findByIdAndProfileId(Long id, Long profileId);
    /*
        SELECT * FROM cft_records
            WHERE profile_id = ?
    */
    List <RecordEntity> findByProfileId(Long profileId);
    /*
        SELECT r.* FROM cft_records r
            JOIN cft_categories c ON c.id = r.category_id
            WHERE r.profile_id = ?
                AND (? IS NULL OR LOWER(r.name) LIKE LOWER(CONCAT('%', ?, '%')))
                AND (? IS NULL OR c.type = ?)
                AND (? IS NULL OR c.category_id = ?)
                AND (? IS NULL OR r.date >= ?)
                AND (? IS NULL OR r.date <= ?)
                AND (? IS NULL OR r.price >= ?)
                AND (? IS NULL OR r.price <= ?)
            ORDER BY ? ASC/DESC
            LIMIT ? OFFSET ?
    */
    @Query(
        """
            SELECT r FROM RecordEntity r
                WHERE r.profile.id = :profileId
                    AND (:keyword       IS NULL OR LOWER(r.name)    LIKE LOWER(CONCAT('%', :keyword, '%')))
                    AND (:type          IS NULL OR r.category.type  = :type)
                    AND (:categoryId    IS NULL OR r.category.id    = :categoryId)
                    AND (:dateStart     IS NULL OR r.date           >= :dateStart)
                    AND (:dateEnd       IS NULL OR r.date           <= :dateEnd)
                    AND (:priceLow      IS NULL OR r.price          >= :priceLow)
                    AND (:priceHigh     IS NULL OR r.price          <= :priceHigh)
        """
    )
    Page<RecordEntity> search(@Param("profileId") Long profileId,
                              @Param("keyword") String keyword,
                              @Param("type") String type,
                              @Param("categoryId") Long categoryId,
                              @Param("dateStart") LocalDate dateStart,
                              @Param("dateEnd") LocalDate dateEnd,
                              @Param("priceLow") BigDecimal priceLow,
                              @Param("priceHigh") BigDecimal priceHigh,
                              Pageable pageable);
    /*
        SELECT r.* FROM cft_records r
            JOIN cft_categories c ON c.id = r.category_id
            WHERE r.profile_id = ?
                AND (? IS NULL OR c.type = ?)
                AND (? IS NULL OR r.date >= ?)
                AND (? IS NULL OR r.date <= ?)
                AND (? IS NULL OR r.price >= ?)
                AND (? IS NULL OR r.price <= ?)
                AND (? IS NULL OR r.category_id IN (?, ...))
                AND (? IS NULL OR LOWER(r.name) LIKE LOWER(CONCAT('%', ?, '%')))
    */
    @Query(
        """
            SELECT r FROM RecordEntity r
            WHERE r.profile.id = :profileId
                AND (:type      IS NULL OR r.category.type          =   :type)
                AND (:dateStart IS NULL OR r.date                       >= :dateStart)
                AND (:dateEnd   IS NULL OR r.date                       <= :dateEnd)
                AND (:priceLow  IS NULL OR r.price                      >= :priceLow)
                AND (:priceHigh IS NULL OR r.price                      <= :priceHigh)
                AND (:#{#categories == null || #categories.isEmpty()}   = true
                                        OR r.category.id                IN :categories)
                AND (:keyword   IS NULL OR LOWER(r.name)                LIKE LOWER(CONCAT('%', :keyword, '%')))
        """
    )
    List <RecordEntity> searchAll(@Param("profileId") Long profileId,
                                  @Param("type") String type,
                                  @Param("dateStart") LocalDate dateStart,
                                  @Param("dateEnd") LocalDate dateEnd,
                                  @Param("priceLow") BigDecimal priceLow,
                                  @Param("priceHigh") BigDecimal priceHigh,
                                  @Param("skipCategories") boolean skipCategories,
                                  @Param("categories") List <Long> categories,
                                  @Param("keyword") String keyword);
}
