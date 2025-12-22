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
    private final EmailService          emailService;   // disable email service for now
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
                                       .isActive(true)   // activate account by default for now
                                       .build();
        newProfile = profileRepository.save(newProfile);
        // disable email activation for now
        /*
        String activationLink = "http://localhost:1989/api/alpha.1.0/activate?token=" + newProfile.getActivationToken();
        String subject = "Activate your Caesar Financial Tracker Account";
        String body = "Click the link to activate your account:\n" + activationLink;
        emailService.sendEmail(newProfile.getEmail(), subject, body);
        */
        return toUserResponse(newProfile);
    }

    private UserResponse toUserResponse(ProfileEntity entity) {
        return new UserResponse(entity.getId(), entity.getFirstName(), entity.getLastName(), entity.getAge(),
                                entity.getEmail(), entity.getProfileImage(), entity.getCreatedAt(),
                                entity.getUpdatedAt());
    }

    public boolean activateProfile(String activationToken) {
        return profileRepository.findByActivationToken(activationToken)
            .map(profile -> {
                profile.setActivationToken(null);
                profile.setActive(true);
                profileRepository.save(profile);
                return true;
            })
            .orElse(false);
    }

    public boolean isAccountActive(String email) {
        return profileRepository.findByEmail(email).map(ProfileEntity::isActive).orElse(false);
    }

    public ProfileEntity getCurrentProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String         email          = authentication.getName();
        return profileRepository.findByEmail(email).orElseThrow(
            () -> new UsernameNotFoundException("Profile not found with email: " + email));
    }

    public UserResponse getPublicProfile(String email) {
        ProfileEntity user = email == null
                               ? getCurrentProfile()
                               : profileRepository.findByEmail(email).orElseThrow(
                                     () -> new UsernameNotFoundException("Profile not found with email: " + email));
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
