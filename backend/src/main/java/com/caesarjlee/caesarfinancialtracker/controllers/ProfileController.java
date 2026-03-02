package com.caesarjlee.caesarfinancialtracker.controllers;

import com.caesarjlee.caesarfinancialtracker.dtos.*;
import com.caesarjlee.caesarfinancialtracker.dtos.profiles.ProfileRequest;
import com.caesarjlee.caesarfinancialtracker.services.ProfileService;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/profiles")
public class ProfileController {
    private final ProfileService profileService;

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(profileService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(profileService.login(request));
    }

    @GetMapping
    public ResponseEntity<RegisterResponse> read() {
        return ResponseEntity.ok(profileService.getPublicProfileInfo());
    }

    @PutMapping
    public ResponseEntity <RegisterResponse> update(@RequestBody @Valid ProfileRequest request){
        return ResponseEntity.ok(profileService.update(request));
    }
}
