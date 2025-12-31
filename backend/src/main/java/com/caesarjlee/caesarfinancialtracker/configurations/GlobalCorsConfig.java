package com.caesarjlee.caesarfinancialtracker.configurations;

import org.apache.catalina.filters.CorsFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
// run before Spring Security and apply to success responses
public class GlobalCorsConfig {
    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.setAllowedOrigins(List.of("http://localhost:5173"));   // allowed frontend origin
        corsConfiguration.setAllowedMethods(
            List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));                         // allowed HTTP methods
        corsConfiguration.setAllowedHeaders(List.of("Content-Type", "Authorization"));   // allowed HTTP headers
        corsConfiguration.setExposedHeaders(List.of("Authorization"));   // allowed headers to read for frontend
        corsConfiguration.setAllowCredentials(false);                    // use JWT instead of cookies
        UrlBasedCorsConfigurationSource urlBasedCorsConfigurationSource = new UrlBasedCorsConfigurationSource();
        urlBasedCorsConfigurationSource.registerCorsConfiguration(
            "/**", corsConfiguration);   // apply cors configuration to all endpoints
        return new CorsFilter(urlBasedCorsConfigurationSource);
    }
}
