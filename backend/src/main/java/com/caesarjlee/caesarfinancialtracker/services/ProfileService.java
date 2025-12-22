package com.caesarjlee.caesarfinancialtracker.services;

import com.caesarjlee.caesarfinancialtracker.dtos.ProfileDto;
import com.caesarjlee.caesarfinancialtracker.entities.ProfileEntity;
import com.caesarjlee.caesarfinancialtracker.repositories.ProfileRepository;

import org.springframework.stereotype.Service;

import java.util.UUID;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProfileService {
    private final ProfileRepository profileRepository;

    // private final EmailService      emailService;

    public ProfileDto               registerProfile(ProfileDto profileDto) {
        if(profileRepository.existsByEmail(profileDto.email()))
            throw new RuntimeException("Email already registered");
        ProfileEntity newProfile = toEntity(profileDto);
        newProfile.setActivationToken(UUID.randomUUID().toString());
        newProfile.setIsActive(true);   // activate account for now
        newProfile = profileRepository.save(newProfile);
        /*
        cannot use cjl.wannabeafreecitizen@gmail.com to send emails
        String activationLink = "http://localhost:1989/api/alpha.1.0/activate?token=" + newProfile.getActivationToken();
        String subject = "Active your Caesar Financial Tracker Account";
        String body    = "click the link to activate your account:\n" + activationLink;
        emailService.sendEmail(newProfile.getEmail(), subject, body);
        */
        return toDto(newProfile);
    }

    public ProfileEntity toEntity(ProfileDto profileDto) {
        return ProfileEntity.builder()
            .id(profileDto.id())
            .firstName(profileDto.firstName())
            .lastName(profileDto.lastName())
            .age(profileDto.age())
            .email(profileDto.email())
            .password(profileDto.password())
            .profileImage(profileDto.profileImage())
            .createdAt(profileDto.createdAt())
            .updatedAt(profileDto.updatedAt())
            .isActive(profileDto.isActive() != null ? profileDto.isActive() : false)
            .activationToken(profileDto.activationToken())
            .build();
    }

    public ProfileDto toDto(ProfileEntity profileEntity) {
        return new ProfileDto(profileEntity.getId(), profileEntity.getFirstName(), profileEntity.getLastName(),
                              profileEntity.getAge(), profileEntity.getEmail(), profileEntity.getPassword(),
                              profileEntity.getProfileImage(), profileEntity.getCreatedAt(),
                              profileEntity.getUpdatedAt(), profileEntity.getIsActive(),
                              profileEntity.getActivationToken());
    }

    public boolean activateProfile(String activationToken) {
        return profileRepository.findByActivationToken(activationToken)
            .map(profile -> {
                profile.setActivationToken(null);
                profile.setIsActive(true);
                profileRepository.save(profile);
                return true;
            })
            .orElse(false);
    }
}
