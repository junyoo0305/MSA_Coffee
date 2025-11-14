package com.example.order.controller;

import com.example.order.dto.OrderRequest;
import com.example.order.model.Order;
import com.example.order.repository.OrderRepository;
import com.example.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin("*")
public class OrderController {

    private final OrderService orderService;
    private final OrderRepository orderRepository;

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody OrderRequest request) {
        try {
            Order order = orderService.placeOrder(request);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            // OrderService에서 throw한 예외 처리
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> statusMap) {

        String newStatus = statusMap.get("status");
        if (newStatus == null) {
            return ResponseEntity.badRequest().build();
        }

        return orderRepository.findById(id)
                .map(order -> {
                    order.setStatus(newStatus); // 상태 변경
                    Order updatedOrder = orderRepository.save(order); // DB에 저장
                    return ResponseEntity.ok(updatedOrder);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}