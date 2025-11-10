package com.example.stock.dto;

import lombok.Data;

@Data
public class StockDecreaseRequest {
    private Long stockId;
    private Integer quantity;
}
