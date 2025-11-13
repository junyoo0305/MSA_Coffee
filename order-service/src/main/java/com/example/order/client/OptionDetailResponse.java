package com.example.order.client;

import lombok.Data;

@Data
public class OptionDetailResponse {
    private Long id;
    private String name;
    private java.math.BigDecimal additionalPrice;
}
