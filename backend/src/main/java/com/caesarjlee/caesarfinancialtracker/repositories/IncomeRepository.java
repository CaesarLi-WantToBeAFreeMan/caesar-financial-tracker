package com.caesarjlee.caesarfinancialtracker.repositories;

import com.caesarjlee.caesarfinancialtracker.entities.IncomeEntity;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface IncomeRepository extends JpaRepository<IncomeEntity, Long> {
    Optional<IncomeEntity> findByIdAndProfileId(Long id, Long profileId);
    // SELECT * FROM cft_incomes WHERE profile_id = ?1 ORDER BY date DESC
    List<IncomeEntity>     findByProfileIdOrderByDateDesc(Long profileId);
    // SELECT * FROM cft_incomes WHERE profile_id = ?1 ORDER BY date DESC LIMIT 5
    List<IncomeEntity>     findTop5ByProfileIdOrderByDateDesc(Long profileId);

    @Query("SELECT SUM(i.price) FROM IncomeEntity i WHERE i.profile.id = :profileId")
    BigDecimal         findTotalIncomeByProfileId(@Param("profileId") Long profileId);

    // SELECT * FROM cft_incomes WHERE profile_id = ?1 AND date BETWEEN ?2 AND ?3 AND LOWER(name) LIKE LOWER('%' || ?4
    // || '%') ORDER BY
    List<IncomeEntity> findByProfileIdAndDateBetweenAndNameContainingIgnoreCase(Long profileId, LocalDate startDate,
                                                                                LocalDate endDate, String keyword,
                                                                                Sort sort);

    // SELECT * FROM cft_incomes WHERE profile_id = ?1 AND date BETWEEN ?2 AND ?3
    List<IncomeEntity> findByProfileIdAndDateBetween(Long profileId, LocalDate startDate, LocalDate endDate);
}
