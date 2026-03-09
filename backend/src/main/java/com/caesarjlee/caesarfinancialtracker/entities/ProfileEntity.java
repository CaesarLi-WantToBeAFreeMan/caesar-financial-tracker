package com.caesarjlee.caesarfinancialtracker.entities;

import org.hibernate.annotations.*;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;

@Entity
@Table(name = "cft_profiles")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProfileEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) Long                        id;
    @Column(name = "first_name")private String                                          firstName;
    @Column(name = "last_name")private String                                           lastName;
    @Column(unique = true) private String                                               email;
    private String                                                                      password;
    @Column(name = "profile_image", columnDefinition = "TEXT")
    private String                                                                      profileImage;
    @Column(name = "created_at", updatable = false) @CreationTimestamp LocalDateTime    createdAt;
    @Column(name = "updated_at")@UpdateTimestamp LocalDateTime                          updatedAt;
}
