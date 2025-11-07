package com.example.order.dto;

import lombok.Data;

@Data
public class OrderDto {
    private Long id;
    private String menuId;
    private int quantity;
}
