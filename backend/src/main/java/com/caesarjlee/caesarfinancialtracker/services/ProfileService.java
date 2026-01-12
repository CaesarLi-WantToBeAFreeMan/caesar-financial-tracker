package com.caesarjlee.caesarfinancialtracker.services;

import com.caesarjlee.caesarfinancialtracker.dtos.LoginRequest;
import com.caesarjlee.caesarfinancialtracker.dtos.LoginResponse;
import com.caesarjlee.caesarfinancialtracker.dtos.RegisterRequest;
import com.caesarjlee.caesarfinancialtracker.dtos.RegisterResponse;
import com.caesarjlee.caesarfinancialtracker.entities.ProfileEntity;
import com.caesarjlee.caesarfinancialtracker.exceptions.authentication.EmailAlreadyRegisteredException;
import com.caesarjlee.caesarfinancialtracker.exceptions.authentication.ProfileNotFoundException;
import com.caesarjlee.caesarfinancialtracker.exceptions.authentication.UnauthenticatedException;
import com.caesarjlee.caesarfinancialtracker.repositories.ProfileRepository;
import com.caesarjlee.caesarfinancialtracker.utilities.JwtService;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
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
    private final JwtService            jwtService;
    private final AuthenticationManager authenticationManager;

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
        ProfileEntity newProfile = ProfileEntity.builder()
                                       .firstName(request.firstName())
                                       .lastName(request.lastName())
                                       .email(request.email())
                                       .password(passwordEncoder.encode(request.password()))
                                       .profileImage(request.profileImage())
                                       .build();
        newProfile = profileRepository.save(newProfile);
        return toRegisterResponse(newProfile);
    }

    public ProfileEntity getCurrentProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication == null || authentication.getName() == null)
            throw new UnauthenticatedException();
        String email = authentication.getName();
        return profileRepository.findByEmail(email).orElseThrow(() -> new ProfileNotFoundException(email));
    }

    public RegisterResponse getPublicProfileInfo() {
        return toRegisterResponse(getCurrentProfile());
    }

    public LoginResponse login(LoginRequest request) {
        var profile = profileRepository.findByEmail(request.email())
                          .orElseThrow(() -> new ProfileNotFoundException(request.email()));
        if(!passwordEncoder.matches(request.password(), profile.getPassword()))
            throw new ProfileNotFoundException(request.email());
        return toLoginResponse(jwtService.generateToken(profile.getEmail()), profile);
    }
}
