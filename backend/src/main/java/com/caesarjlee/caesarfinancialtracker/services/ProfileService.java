package com.caesarjlee.caesarfinancialtracker.services;

import com.caesarjlee.caesarfinancialtracker.dtos.*;
import com.caesarjlee.caesarfinancialtracker.dtos.profiles.ProfileRequest;
import com.caesarjlee.caesarfinancialtracker.entities.ProfileEntity;
import com.caesarjlee.caesarfinancialtracker.exceptions.authentication.*;
import com.caesarjlee.caesarfinancialtracker.repositories.ProfileRepository;
import com.caesarjlee.caesarfinancialtracker.utilities.JwtService;

import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.*;
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
    private final JwtService            jwtService;

    private RegisterResponse            toRegisterResponse(ProfileEntity entity) {
        return new RegisterResponse(entity.getId(), entity.getFirstName(), entity.getLastName(), entity.getEmail(),
                                               entity.getProfileImage(), entity.getCreatedAt(), entity.getUpdatedAt());
    }

    private LoginResponse toLoginResponse(String token, ProfileEntity entity) {
        return new LoginResponse(token, entity.getId(), entity.getFirstName(), entity.getLastName(), entity.getEmail(),
                                 entity.getProfileImage(), entity.getCreatedAt(), entity.getUpdatedAt());
    }

    public RegisterResponse register(RegisterRequest request) {
        if(profileRepository.existsByEmail(request.email()))
            throw new EmailAlreadyRegisteredException(request.email());
        return toRegisterResponse(profileRepository.save(ProfileEntity.builder()
                                                                    .firstName(request.firstName())
                                                                    .lastName(request.lastName())
                                                                    .email(request.email())
                                                                    .password(passwordEncoder.encode(request.password()))
                                                                    .profileImage(request.profileImage())
                                                                    .build()));
    }

    public ProfileEntity getCurrentProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication == null || authentication.getName() == null)
            throw new UnauthenticatedException();
        String email = authentication.getName();
        return profileRepository.findByEmail(email).orElseThrow(() -> new ProfileNotFoundException(email));
    }

    public LoginResponse login(LoginRequest request) {
        var profile = profileRepository.findByEmail(request.email())
                          .orElseThrow(() -> new ProfileNotFoundException(request.email()));
        if(!passwordEncoder.matches(request.password(), profile.getPassword()))
            throw new ProfileNotFoundException(request.email());
        return toLoginResponse(jwtService.generateToken(profile.getEmail()), profile);
    }

    public RegisterResponse update(ProfileRequest request){
        ProfileEntity profile = profileRepository.findByEmail(request.email())
                                                .orElseThrow(() -> new ProfileNotFoundException(request.email()));
        if(request.firstName() != null && !request.firstName().isBlank())
            profile.setFirstName(request.firstName());
        if(request.lastName() != null && !request.lastName().isBlank())
            profile.setLastName(request.lastName());
        if(request.password() != null && !request.password().isBlank())
            profile.setPassword(passwordEncoder.encode(request.password()));
        if(request.profileImage() != null && !request.profileImage().isBlank())
            profile.setProfileImage(request.profileImage());
        return toRegisterResponse(profileRepository.save(profile));
    }
}
