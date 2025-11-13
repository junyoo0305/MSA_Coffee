package com.example.order.dto;

import lombok.Data;
import java.util.List;

@Data
public class OrderRequest {
    private String customerName;
    private List<ItemDto> items;

    @Data
    public static class ItemDto {
        private Long menuId; // 사용자는 메뉴 ID만 알면 됨
        private Integer quantity;
        private List<Long> optionIds;
    }
}