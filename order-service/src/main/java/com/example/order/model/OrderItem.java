package com.example.order.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "ORDER_ITEMS")
@Data
@NoArgsConstructor
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long menuId; // menu-service의 ID
    private Long stockId; // stock-service의 ID
    private Integer quantity;
    private BigDecimal pricePerItem; // 주문 시점의 가격

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;

    public OrderItem(Order order, Long menuId, Long stockId, Integer quantity, BigDecimal pricePerItem) {
        this.order = order;
        this.menuId = menuId;
        this.stockId = stockId;
        this.quantity = quantity;
        this.pricePerItem = pricePerItem;
    }
}