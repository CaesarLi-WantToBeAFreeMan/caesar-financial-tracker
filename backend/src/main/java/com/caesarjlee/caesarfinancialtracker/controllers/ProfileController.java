package com.caesarjlee.caesarfinancialtracker.controllers;

import com.caesarjlee.caesarfinancialtracker.dtos.ProfileDto;
import com.caesarjlee.caesarfinancialtracker.services.ProfileService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class ProfileController {
    private final ProfileService profileService;

    @PostMapping("/register")
    public ResponseEntity<ProfileDto> registerProfile(@RequestBody ProfileDto profileDto) {
        ProfileDto registerProfile = profileService.registerProfile(profileDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(registerProfile);
    }

    @GetMapping("/activate")
    public ResponseEntity<String> activateProfile(@RequestParam String token) {
        if(profileService.activateProfile(token))
            return ResponseEntity.ok("Profile activated successfully");
        else
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Activation token not found or already used");
    }
}
