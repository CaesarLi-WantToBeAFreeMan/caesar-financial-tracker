package com.caesarjlee.caesarfinancialtracker.repositories;

import com.caesarjlee.caesarfinancialtracker.entities.ProfileEntity;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProfileRepository extends JpaRepository<ProfileEntity, Long> {
    // SELECT * FROM cft_profiles WHERE email = ?
    Optional<ProfileEntity> findByEmail(String email);

    // SELECT EXISTS(SELECT 1 FROM cft_profiles p WHERE p.email = ?)
    boolean                 existsByEmail(String email);
}
