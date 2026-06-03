package com.caesarjlee.caesarfinancialtracker.configurations;

import com.caesarjlee.caesarfinancialtracker.securities.JwtAuthenticationFilter;
import com.caesarjlee.caesarfinancialtracker.services.AppUserDetailsService;

import org.springframework.context.annotation.*;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.*;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfigurationSource;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final AppUserDetailsService   appUserDetailsService;
    private final CorsConfigurationSource corsConfigurationSource;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
            .cors(cors -> cors.configurationSource(corsConfigurationSource))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(
                authentication ->
                    authentication
                        // .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        // .requestMatchers("/profiles/register", "/profiles/login").permitAll()
                        .requestMatchers(AntPathRequestMatcher
                            .antMatcher(HttpMethod.OPTIONS, "/**")).permitAll()
                        .requestMatchers(AntPathRequestMatcher
                            .antMatcher("/profiles/login"))
                            .permitAll()
                        .requestMatchers(AntPathRequestMatcher
                            .antMatcher("/profiles/register"))
                            .permitAll()
                        .requestMatchers(AntPathRequestMatcher
                            .antMatcher("/api/alpha/profiles/login"))
                            .permitAll()
                        .requestMatchers(AntPathRequestMatcher
                            .antMatcher("/api/alpha/profiles/register"))
                            .permitAll()
                        .anyRequest()
                            .authenticated()
            )
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return httpSecurity.build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(appUserDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
