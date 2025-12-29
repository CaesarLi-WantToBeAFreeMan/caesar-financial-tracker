package com.caesarjlee.caesarfinancialtracker.services;

import com.caesarjlee.caesarfinancialtracker.dtos.AuthRequest;
import com.caesarjlee.caesarfinancialtracker.dtos.AuthResponse;
import com.caesarjlee.caesarfinancialtracker.dtos.RegisterRequest;
import com.caesarjlee.caesarfinancialtracker.dtos.UserResponse;
import com.caesarjlee.caesarfinancialtracker.entities.ProfileEntity;
import com.caesarjlee.caesarfinancialtracker.repositories.ProfileRepository;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProfileService {
    private final ProfileRepository     profileRepository;
    private final PasswordEncoder       passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService            jwtService;

    public UserResponse                 registerProfile(RegisterRequest request) {
        if(profileRepository.existsByEmail(request.email()))
            throw new RuntimeException("Email already registered");
        ProfileEntity newProfile = ProfileEntity.builder()
                                       .firstName(request.firstName())
                                       .lastName(request.lastName())
                                       .age(request.age())
                                       .email(request.email())
                                       .password(passwordEncoder.encode(request.password()))
                                       .profileImage(request.profileImage())
                                       .activationToken(UUID.randomUUID().toString())
                                       .isActive(true)
                                       .build();
        newProfile = profileRepository.save(newProfile);
        return toUserResponse(newProfile);
    }

    private UserResponse toUserResponse(ProfileEntity entity) {
        return new UserResponse(entity.getId(), entity.getFirstName(), entity.getLastName(), entity.getAge(),
                                entity.getEmail(), entity.getProfileImage(), entity.getCreatedAt(),
                                entity.getUpdatedAt());
    }

    public ProfileEntity getCurrentProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String         email          = authentication.getName();
        return profileRepository.findByEmail(email).orElseThrow(
            () -> new UsernameNotFoundException("Profile not found: " + email));
    }

    public UserResponse getPublicProfile(String email) {
        ProfileEntity user = email == null ? getCurrentProfile()
                                           : profileRepository.findByEmail(email).orElseThrow(
                                                 () -> new UsernameNotFoundException("Profile not found: " + email));
        return toUserResponse(user);
    }

    public AuthResponse authenticateAndGenerateToken(AuthRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.email(), request.password()));
        String       token = jwtService.generateToken(request.email());
        UserResponse user  = getPublicProfile(request.email());
        return new AuthResponse(token, user);
    }
}
