package com.caesarjlee.caesarfinancialtracker.controllers;

import com.caesarjlee.caesarfinancialtracker.dtos.LoginRequest;
import com.caesarjlee.caesarfinancialtracker.dtos.LoginResponse;
import com.caesarjlee.caesarfinancialtracker.dtos.RegisterRequest;
import com.caesarjlee.caesarfinancialtracker.dtos.RegisterResponse;
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
    public ResponseEntity<RegisterResponse> register(@Valid @RequestBody RegisterRequest request) {
        RegisterResponse registeredUser = profileService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(registeredUser);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = profileService.login(request);
        return ResponseEntity.ok(response);
    }
}
