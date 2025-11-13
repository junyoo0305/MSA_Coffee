package com.example.order.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

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
    private Integer quantity; // 주문 수량
    private BigDecimal pricePerItem; // 주문 시점의 가격

    @Column(nullable = false) // (주문 항목에 메뉴 이름 저장)
    private String menuName;

    @JsonIgnore // <--- 핵심 (무한 순환 오류 해결)
    @ManyToOne(fetch = FetchType.LAZY) // (주문 '항목'은 하나의 '주문'에 속함)
    @JoinColumn(name = "order_id")
    private Order order;

    @OneToMany(mappedBy = "orderItem", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<OrderItemOption> selectedOptions = new ArrayList<>();

    public OrderItem(Order order, Long menuId, String menuName, Long stockId, Integer quantity, BigDecimal pricePerItem) {
        this.order = order;
        this.menuId = menuId;
        this.menuName = menuName; // ★★★ 생성자에 추가 ★★★
        this.stockId = stockId;
        this.quantity = quantity;
        this.pricePerItem = pricePerItem;
    }
}