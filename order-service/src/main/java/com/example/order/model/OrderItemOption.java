package com.example.order.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "ORDER_ITEM_OPTIONS")
@Data
@NoArgsConstructor
public class OrderItemOption {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long optionId; // menu-service의 Option ID
    private String optionName; // (기록용) "Size Up"
    private java.math.BigDecimal additionalPrice; // (기록용) 500

    @JsonIgnore // (순환 참조 방지)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_item_id")
    private OrderItem orderItem;

    // OrderService 57라인에 사용할 생성자
    public OrderItemOption(Long optionId, String optionName, java.math.BigDecimal price, OrderItem item) {
        this.optionId = optionId;
        this.optionName = optionName;
        this.additionalPrice = price;
        this.orderItem = item;
    }
}