package com.example.menu.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StockCreateRequest {
    private String name;
    private String description;
    private Integer stock; // 초기 재고
}