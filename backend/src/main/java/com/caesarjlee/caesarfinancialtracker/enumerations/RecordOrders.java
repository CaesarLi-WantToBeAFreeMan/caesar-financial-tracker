package com.caesarjlee.caesarfinancialtracker.enumerations;

import org.springframework.data.domain.Sort;

import lombok.*;

@RequiredArgsConstructor
@Getter
public enum RecordOrders {
    NAME_ASCENDING      (Sort.by(Sort.Direction.ASC,    "name")),
    NAME_DESCENDING     (Sort.by(Sort.Direction.DESC,   "name")),
    DATE_ASCENDING      (Sort.by(Sort.Direction.ASC,    "date")),
    DATE_DESCENDING     (Sort.by(Sort.Direction.DESC,   "date")),
    PRICE_ASCENDING     (Sort.by(Sort.Direction.ASC,    "price")),
    PRICE_DESCENDING    (Sort.by(Sort.Direction.DESC,   "price")),
    CREATED_ASCENDING   (Sort.by(Sort.Direction.ASC,    "createdAt")),
    CREATED_DESCENDING  (Sort.by(Sort.Direction.DESC,   "createdAt")),
    UPDATED_ASCENDING   (Sort.by(Sort.Direction.ASC,    "updatedAt")),
    UPDATED_DESCENDING  (Sort.by(Sort.Direction.DESC,   "updatedAt"));

    private final Sort sort;
}
