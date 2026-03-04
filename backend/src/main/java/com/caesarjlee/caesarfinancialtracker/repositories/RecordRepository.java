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
    @Query(
        value = """
            SELECT r.* FROM cft_records r
            JOIN cft_categories c ON c.id = r.category_id
            WHERE r.profile_id = :profileId
                AND (:keyword                       IS NULL OR LOWER(r.name)    LIKE :keyword)
                AND (:type                          IS NULL OR LOWER(c.type)    =   :type)
                AND (CAST(:categoryId AS BIGINT)    IS NULL OR r.category_id    =   :categoryId)
                AND (CAST(:dateStart  AS DATE)      IS NULL OR r.date           >=  :dateStart)
                AND (CAST(:dateEnd    AS DATE)      IS NULL OR r.date           <=  :dateEnd)
                AND (CAST(:priceLow   AS NUMERIC)   IS NULL OR r.price          >=  :priceLow)
                AND (CAST(:priceHigh  AS NUMERIC)   IS NULL OR r.price          <=  :priceHigh)
        """,
        countQuery = """
            SELECT COUNT(*) FROM cft_records r
            JOIN cft_categories c ON c.id = r.category_id
            WHERE r.profile_id = :profileId
                AND (:keyword                       IS NULL OR LOWER(r.name)    LIKE :keyword)
                AND (:type                          IS NULL OR LOWER(c.type)    =   :type)
                AND (CAST(:categoryId AS BIGINT)    IS NULL OR r.category_id    =   :categoryId)
                AND (CAST(:dateStart  AS DATE)      IS NULL OR r.date           >=  :dateStart)
                AND (CAST(:dateEnd    AS DATE)      IS NULL OR r.date           <=  :dateEnd)
                AND (CAST(:priceLow   AS NUMERIC)   IS NULL OR r.price          >=  :priceLow)
                AND (CAST(:priceHigh  AS NUMERIC)   IS NULL OR r.price          <=  :priceHigh)
        """,
        nativeQuery = true
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
    @Query(
        value = """
            SELECT r.* FROM cft_records r
            JOIN cft_categories c ON c.id = r.category_id
            WHERE r.profile_id = :profileId
                AND (:type                          IS NULL OR LOWER(c.type)    =    :type)
                AND (CAST(:dateStart  AS DATE)      IS NULL OR r.date           >=   :dateStart)
                AND (CAST(:dateEnd    AS DATE)      IS NULL OR r.date           <=   :dateEnd)
                AND (CAST(:priceLow   AS NUMERIC)   IS NULL OR r.price          >=   :priceLow)
                AND (CAST(:priceHigh  AS NUMERIC)   IS NULL OR r.price          <=   :priceHigh)
                AND (:skipCategories  = true        OR r.category_id            IN   (:categories))
                AND (:keyword                       IS NULL OR LOWER(r.name)    LIKE :keyword)
        """,
        nativeQuery = true
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
