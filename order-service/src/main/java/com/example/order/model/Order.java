package com.example.order.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long menuId;
    private int quantity;
    private int totalPrice;

    @Enumerated(EnumType.STRING)
    private Status status; // ✅ 내부 enum 사용

    public enum Status {
        CREATED,   // 주문 생성됨
        CONFIRMED, // 결제 완료
        CANCELLED  // 주문 취소됨
    }

}
