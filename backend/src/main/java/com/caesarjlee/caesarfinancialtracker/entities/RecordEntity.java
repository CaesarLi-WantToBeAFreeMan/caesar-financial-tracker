package com.caesarjlee.caesarfinancialtracker.entities;

import java.math.BigDecimal;
import java.time.*;

import org.hibernate.annotations.*;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cft_records")
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
public class RecordEntity{
    @EqualsAndHashCode.Include @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable = false) private String name;
    @Column(nullable = false) private String icon;
    @Column(nullable = false) private String type;
    @Column(nullable = false) private LocalDate date;
    @Column(nullable = false) private BigDecimal price;
    @Column(nullable = false) private String description;
    @Column(updatable = false) @CreationTimestamp private LocalDateTime createdAt;
    @UpdateTimestamp private LocalDateTime updatedAt;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private CategoryEntity category;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "profile_id", nullable = false) private ProfileEntity profile;
}
