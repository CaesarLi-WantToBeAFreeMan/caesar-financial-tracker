package com.caesarjlee.caesarfinancialtracker.enumerations;

import org.springframework.data.domain.Sort;

import lombok.*;

@RequiredArgsConstructor
@Getter
public enum CategoryOrders {
    NAME_ASCENDING      (Sort.by(Sort.Direction.ASC,    "name")),
    NAME_DESCENDING     (Sort.by(Sort.Direction.DESC,   "name")),
    CREATED_ASCENDING   (Sort.by(Sort.Direction.ASC,    "createdAt")),
    CREATED_DESCENDING  (Sort.by(Sort.Direction.DESC,   "createdAt")),
    UPDATED_ASCENDING   (Sort.by(Sort.Direction.ASC,    "updatedAt")),
    UPDATED_DESCENDING  (Sort.by(Sort.Direction.DESC,   "updatedAt"));

    private final Sort sort;
}
