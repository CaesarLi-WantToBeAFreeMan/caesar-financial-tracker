package com.caesarjlee.caesarfinancialtracker.repositories;

import com.caesarjlee.caesarfinancialtracker.entities.IncomeEntity;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface IncomeRepository extends JpaRepository<IncomeEntity, Long> {
    Optional<IncomeEntity> findByIdAndProfileId(Long id, Long profileId);
    List<IncomeEntity>     findByProfileId(Long profileId);
    @Query("""
        SELECT i
        FROM IncomeEntity i
        WHERE i.profile.id =:profileId
        AND (:keyword IS NULL OR LOWER(i.name) LIKE LOWER(CONCAT('%', :keyword, '%')))
        AND (:categoryId IS NULL OR i.category.id = :categoryId)
        AND (:dateStart IS NULL OR i.date >= :dateStart)
        AND (:dateEnd IS NULL OR i.date <= :dateEnd)
        AND (:priceLow IS NULL OR i.price >= :priceLow)
        AND (:priceHigh IS NULL OR i.price <= :priceHigh)
    """)
    Page<IncomeEntity> search(@Param("profileId") Long profileId, @Param("keyword") String keyword,
                              @Param("categoryId") Long categoryId, @Param("dateStart") LocalDate dateStart,
                              @Param("dateEnd") LocalDate dateEnd, @Param("priceLow") BigDecimal priceLow,
                              @Param("priceHigh") BigDecimal priceHigh, Pageable pageable);
}
