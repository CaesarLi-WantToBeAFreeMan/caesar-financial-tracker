package com.caesarjlee.caesarfinancialtracker.dtos.imports;

import java.util.*;
import lombok.Getter;

@Getter
public class ImportResponse {
    private long  success;
    private long  failed;
    private final List<String> errors = new ArrayList<>();

    public void                success() {
        this.success++;
    }

    public void                fail(String message) {
        this.failed++;
        this.errors.add(message);
    }
}
