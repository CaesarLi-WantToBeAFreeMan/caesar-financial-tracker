package com.caesarjlee.caesarfinancialtracker.dtos;

import java.util.ArrayList;
import java.util.List;
import lombok.Getter;

@Getter
public class ImportResponse {
    private long  success;
    private long  failed;
    private final List<String> errors = new ArrayList<>();

    public void                success() {
        this.success++;
    }

    public void fail(String message) {
        this.failed++;
        this.errors.add(message);
    }
}
