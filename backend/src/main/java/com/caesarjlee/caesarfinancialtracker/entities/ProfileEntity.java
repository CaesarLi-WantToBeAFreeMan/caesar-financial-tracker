package com.caesarjlee.caesarfinancialtracker.entities;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "cft_profiles")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProfileEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) Long id;
    private String                                               firstName;
    private String                                               lastName;
    private Integer                                              age;
    @Column(unique = true) private String                        email;
    private String                                               password;
    private String                                               profileImage;
    @Column(updatable = false) @CreationTimestamp LocalDateTime  createdAt;
    @UpdateTimestamp LocalDateTime                               updatedAt;
    private Boolean                                              isActive = false;
    private String                                               activationToken;
}
