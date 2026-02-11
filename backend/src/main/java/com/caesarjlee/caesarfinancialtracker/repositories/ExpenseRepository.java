package com.caesarjlee.caesarfinancialtracker.repositories;

import com.caesarjlee.caesarfinancialtracker.entities.ExpenseEntity;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ExpenseRepository extends JpaRepository<ExpenseEntity, Long> {
    Optional<ExpenseEntity> findByIdAndProfileId(Long id, Long profileId);
    List<ExpenseEntity>     findByProfileId(Long profileId);
    @Query("""
        SELECT e
        FROM ExpenseEntity e
        WHERE e.profile.id =:profileId
        AND (:keyword IS NULL OR LOWER(e.name) LIKE LOWER(CONCAT('%', :keyword, '%')))
        AND (:categoryId IS NULL OR e.category.id = :categoryId)
        AND (:dateStart IS NULL OR e.date >= :dateStart)
        AND (:dateEnd IS NULL OR e.date <= :dateEnd)
        AND (:priceLow IS NULL OR e.price >= :priceLow)
        AND (:priceHigh IS NULL OR e.price <= :priceHigh)
    """)
    Page<ExpenseEntity> search(@Param("profileId") Long profileId, @Param("keyword") String keyword,
                               @Param("categoryId") Long categoryId, @Param("dateStart") LocalDate dateStart,
                               @Param("dateEnd") LocalDate dateEnd, @Param("priceLow") BigDecimal priceLow,
                               @Param("priceHigh") BigDecimal priceHigh, Pageable pageable);
}
