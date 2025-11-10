package com.example.menu.dto;

import lombok.Data;

@Data
public class StockCreateResponse {
    private Long id; // stock-service에서 생성된 ID
    private String name;
    private String description;
    private Integer stock;
}