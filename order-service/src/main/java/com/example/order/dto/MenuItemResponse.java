package com.example.order.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class MenuItemResponse {
    private Long id;
    private String name;
    private BigDecimal price;
    private Long stockId; // **가장 중요**
}