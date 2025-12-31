package com.caesarjlee.caesarfinancialtracker.securities;

import com.caesarjlee.caesarfinancialtracker.securities.JwtAuthenticationFilter;
import com.caesarjlee.caesarfinancialtracker.services.AppUserDetailsService;
import com.caesarjlee.caesarfinancialtracker.utilities.JwtService;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;
import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class SecurityConfiguration {
    private final AppUserDetailsService appUserDetailsService;   // load users from database
    private final JwtService            jwtService;              // JWT utility service

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.cors(cors
                  -> cors.configurationSource(
                      corsConfigurationSource()))   // make Spring Security applies CORS before auth filtera
            .csrf(csrf -> csrf.disable())           // disable CSRF to use JWT token
            .authorizeHttpRequests(auth             // authorization rules
                                   -> auth.requestMatchers(HttpMethod.OPTIONS, "/**")
                                          .permitAll()   // allow all preflights (OPTIONS) that were sent by browsers
                                                         // for CORS automatically
                                          .requestMatchers("/api/alpha.1.0/register", "/api/alpha.1.0/login")
                                          .permitAll()   // public (unauthorized) endpoints
                                          .anyRequest()
                                          .authenticated()   // everything else needs authentication
                                   )
            // every request carries JWT rather then HTTP session
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            // add JWT filter before authentication
            .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    // password encoder used when saving/verifying passwords
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    // frontend calls this to communicate with backend
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.setAllowedOrigins(List.of("http://localhost:5173"));   // allowed frontend origins
        corsConfiguration.setAllowedMethods(
            List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));                         // allowed HTTP methods
        corsConfiguration.setAllowedHeaders(List.of("Content-Type", "Authorization"));   // allowed HTTP headers
        corsConfiguration.setExposedHeaders(List.of("Authorization"));                   // headers exposed to frontend
        corsConfiguration.setAllowCredentials(false);                                    // use JWT instead of cookies
        UrlBasedCorsConfigurationSource source =
            new UrlBasedCorsConfigurationSource();   // apply CORS configuration to all endpoints
        source.registerCorsConfiguration("/**", corsConfiguration);
        return source;
    }

    @Bean
    // authentication manager used by login endpoint
    public AuthenticationManager authenticationManager() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(appUserDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return new ProviderManager(provider);
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter(jwtService, appUserDetailsService);
    }
}
