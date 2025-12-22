package com.caesarjlee.caesarfinancialtracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.caesarjlee.caesarfinancialtracker")
public class CaesarFinancialTrackerApplication {
    public static void main(String [] args) {
        SpringApplication.run(CaesarFinancialTrackerApplication.class, args);
    }
}
