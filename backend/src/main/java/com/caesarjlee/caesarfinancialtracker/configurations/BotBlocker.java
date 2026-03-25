package com.caesarjlee.caesarfinancialtracker.configurations;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.*;

/*
 * block bots and unauthorized requests
 * only allow:
 *  1. allowed frontend origins (localhost and caesaris.net)
 *  2. with a valid Bearer token
 *  3. OPTIONS preflight requests
 */
@Component
@Order(1)
public class BotBlocker implements Filter {
    @Value("${app.cors.allowed-origins}") private String allowedOriginsRaw;

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain)
        throws IOException, ServletException {
        HttpServletRequest  httpServletRequest  = (HttpServletRequest)servletRequest;
        HttpServletResponse httpServletResponse = (HttpServletResponse)servletResponse;

        // allow CORS preflight
        if("OPTIONS".equalsIgnoreCase(httpServletRequest.getMethod())) {
            filterChain.doFilter(httpServletRequest, httpServletResponse);
            return;
        }

        String       origin              = httpServletRequest.getHeader("Origin");
        String       authorizationHeader = httpServletRequest.getHeader("Authorization");

        List<String> allowedOrigins =
            Arrays.stream(allowedOriginsRaw.split(",")).map(String::trim).filter(str -> !str.isEmpty()).toList();

        boolean hasValidOrigin        = origin != null && allowedOrigins.contains(origin);
        boolean hasAuthoricationToken = authorizationHeader != null && authorizationHeader.startsWith("Bearer");

        // block if neither an allowed origin nor a valid JWT token
        if(!hasValidOrigin && !hasAuthoricationToken) {
            httpServletResponse.setStatus(HttpServletResponse.SC_FORBIDDEN);
            httpServletResponse.setContentType("application/json");
            httpServletResponse.getWriter().write("{\"error\": \"Access denied\"}");
            return;
        }

        filterChain.doFilter(httpServletRequest, httpServletResponse);
    }
}
