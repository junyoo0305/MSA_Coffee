package com.example.order.service;

import com.example.order.client.MenuServiceFeignClient;
import com.example.order.client.StockServiceFeignClient;
import com.example.order.dto.MenuItemResponse;
import com.example.order.dto.OrderRequest;
import com.example.order.dto.StockDecreaseRequest;
import com.example.order.model.Order;
import com.example.order.model.OrderItem;
import com.example.order.repository.OrderRepository;
import feign.FeignException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final MenuServiceFeignClient menuServiceFeignClient;
    private final StockServiceFeignClient stockServiceFeignClient;

    @Transactional
    public Order placeOrder(OrderRequest orderRequest) {

        // 1. 주문(Order) 엔티티 생성
        Order order = new Order();
        order.setCustomerName(orderRequest.getCustomerName());
        order.setStatus("PENDING"); // 초기 상태

        BigDecimal totalPrice = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        try {
            // 2. 주문 항목(Items)별로 menu-service에서 정보 조회
            for (OrderRequest.ItemDto itemDto : orderRequest.getItems()) {
                MenuItemResponse menu = menuServiceFeignClient.getMenuById(itemDto.getMenuId());

                // 3. 재고 차감 요청 (stock-service 호출)
                StockDecreaseRequest decreaseRequest = new StockDecreaseRequest(menu.getStockId(), itemDto.getQuantity());

                log.info("Requesting stock decrease: {}", decreaseRequest);
                ResponseEntity<String> response = stockServiceFeignClient.decreaseStock(decreaseRequest);
                log.info("Stock decrease response: {}", response.getStatusCode());

                // 4. 주문 항목 생성
                OrderItem orderItem = new OrderItem(order, menu.getId(), menu.getStockId(), itemDto.getQuantity(), menu.getPrice());
                orderItems.add(orderItem);
                totalPrice = totalPrice.add(menu.getPrice().multiply(BigDecimal.valueOf(itemDto.getQuantity())));
            }

            // 5. 모든 재고 차감이 성공한 경우
            order.setStatus("COMPLETED");
            order.setTotalPrice(totalPrice);
            order.setItems(orderItems);
            return orderRepository.save(order);

        } catch (FeignException e) {
            // 6. 재고 부족 또는 통신 실패 시 (stock-service에서 400 or 500 응답)
            log.error("Failed to decrease stock: {}", e.getMessage());
            order.setStatus("FAILED");
            orderRepository.save(order); // 실패한 주문도 기록

            // 여기서 중요: 이미 성공한 재고 차감을 되돌리는 "보상 트랜잭션(Saga)"이 필요할 수 있습니다.
            // (예: stock-service에 increaseStock API를 만들어 호출)
            // 지금은 단순화를 위해 실패로만 처리합니다.
            throw new RuntimeException("Order failed due to stock issue: " + e.getMessage());
        }
    }
}