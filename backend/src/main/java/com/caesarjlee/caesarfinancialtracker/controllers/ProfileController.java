package com.caesarjlee.caesarfinancialtracker.controllers;

import com.caesarjlee.caesarfinancialtracker.dtos.AuthRequest;
import com.caesarjlee.caesarfinancialtracker.dtos.AuthResponse;
import com.caesarjlee.caesarfinancialtracker.dtos.RegisterRequest;
import com.caesarjlee.caesarfinancialtracker.dtos.UserResponse;
import com.caesarjlee.caesarfinancialtracker.services.ProfileService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class ProfileController {
    private final ProfileService profileService;

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest request) {
        UserResponse registeredUser = profileService.registerProfile(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(registeredUser);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        AuthResponse response = profileService.authenticateAndGenerateToken(request);
        return ResponseEntity.ok(response);
    }
}
