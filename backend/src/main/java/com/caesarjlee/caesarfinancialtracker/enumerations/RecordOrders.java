package com.caesarjlee.caesarfinancialtracker.enumerations;

import org.springframework.data.domain.Sort;

import lombok.*;

@RequiredArgsConstructor
@Getter
public enum RecordOrders {
    NAME_ASCENDING(Sort.by("name").ascending()),
    NAME_DESCENDING(Sort.by("name").descending()),
    DATE_ASCENDING(Sort.by("date").ascending()),
    DATE_DESCENDING(Sort.by("date").descending()),
    PRICE_ASCENDING(Sort.by("price").ascending()),
    PRICE_DESCENDING(Sort.by("price").descending()),
    CREATED_ASCENDING(Sort.by("createdAt").ascending()),
    CREATED_DESCENDING(Sort.by("createdAt").descending()),
    UPDATED_ASCENDING(Sort.by("updatedAt").ascending()),
    UPDATED_DESCENDING(Sort.by("updatedAt").descending());

    private final Sort sort;
}
