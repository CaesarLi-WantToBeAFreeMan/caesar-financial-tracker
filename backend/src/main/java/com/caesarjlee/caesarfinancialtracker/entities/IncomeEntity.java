package com.caesarjlee.caesarfinancialtracker.entities;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "cft_incomes")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class IncomeEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    private String                                                       name;
    private String                                                       icon;
    private LocalDate                                                    date;
    private BigDecimal                                                   price;
    private String                                                       description;
    @Column(updatable = false) @CreationTimestamp private LocalDateTime  createdAt;
    @UpdateTimestamp private LocalDateTime                               updatedAt;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private CategoryEntity category;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "profile_id", nullable = false) private ProfileEntity profile;
}
