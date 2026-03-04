package com.caesarjlee.caesarfinancialtracker.entities;

import org.hibernate.annotations.*;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;

@Entity
@Table(name = "cft_categories")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CategoryEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long                                        id;
    private String                                                                                              name;
    private String                                                                                              type;
    private String                                                                                              icon;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "profile_id", nullable = false) private ProfileEntity profile;
    @Column(name = "created_at", updatable = false) @CreationTimestamp private LocalDateTime createdAt;
    @Column(name = "updated_at") @UpdateTimestamp private LocalDateTime                              updatedAt;
}
