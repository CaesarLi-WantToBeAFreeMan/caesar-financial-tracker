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
    CREATED_ASCENDING   (Sort.by(Sort.Direction.ASC,    "created_at")),
    CREATED_DESCENDING  (Sort.by(Sort.Direction.DESC,   "created_at")),
    UPDATED_ASCENDING   (Sort.by(Sort.Direction.ASC,    "updated_at")),
    UPDATED_DESCENDING  (Sort.by(Sort.Direction.DESC,   "updated_at"));

    private final Sort sort;
}
