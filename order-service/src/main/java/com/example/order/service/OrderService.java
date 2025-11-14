package com.example.order.service;

import com.example.order.client.MenuServiceFeignClient;
import com.example.order.client.OptionDetailResponse;
import com.example.order.client.StockServiceFeignClient;
import com.example.order.dto.MenuItemResponse;
import com.example.order.dto.OrderRequest;
import com.example.order.dto.StockDecreaseRequest;
import com.example.order.model.Order;
import com.example.order.model.OrderItem;
import com.example.order.model.OrderItemOption;
import com.example.order.repository.OrderRepository;
import feign.FeignException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;


@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final MenuServiceFeignClient menuServiceFeignClient;
    private final StockServiceFeignClient stockServiceFeignClient;

    @Transactional
    public Order placeOrder(OrderRequest orderRequest) {
        Order order = new Order();
        order.setStatus("PENDING");
        order.setCustomerName(orderRequest.getCustomerName());
        BigDecimal grandTotal = BigDecimal.ZERO; // 총 주문 금액

        try {
            for (OrderRequest.ItemDto itemDto : orderRequest.getItems()) {

                // 1. 기본 메뉴 정보 가져오기 (가격, *대표 stockId*)
                MenuItemResponse menu = menuServiceFeignClient.getMenuById(itemDto.getMenuId());
                BigDecimal finalPricePerItem = menu.getPrice(); // 기본 가격으로 시작

                // 2. [재고 로직 - 단순]
                // 요청하신대로, 대표 stockId 하나만 차감합니다.
                stockServiceFeignClient.decreaseStock(
                        new StockDecreaseRequest(menu.getStockId(), itemDto.getQuantity())
                );

                // 3. 주문 항목(OrderItem) 생성 (가격은 나중에 세팅)
                OrderItem orderItem = new OrderItem(order,
                        menu.getId(),
                        menu.getName(),
                        menu.getStockId(),
                        itemDto.getQuantity(),
                        BigDecimal.ZERO
                );

                // 4. [가격 및 기록 로직 - 복잡]
                // 선택한 옵션 ID 목록이 있다면
                if (itemDto.getOptionIds() != null && !itemDto.getOptionIds().isEmpty()) {

                    // 4-1. MENU-SERVICE에 옵션 상세 정보 요청
                    List<OptionDetailResponse> optionDetails =
                            menuServiceFeignClient.getOptionDetails(itemDto.getOptionIds());

                    for (OptionDetailResponse detail : optionDetails) {
                        // 4-2. (기록) 주문 항목에 옵션 정보 저장 (영수증용)
                        orderItem.getSelectedOptions().add(
                                new OrderItemOption(detail.getId(), detail.getName(), detail.getAdditionalPrice(), orderItem)
                        );
                        // 4-3. (가격) 최종 가격에 옵션 추가금 더하기
                        finalPricePerItem = finalPricePerItem.add(detail.getAdditionalPrice());
                    }
                }

                // 5. 최종 가격 세팅
                orderItem.setPricePerItem(finalPricePerItem);
                order.getItems().add(orderItem);

                // 6. 총 주문 금액 누적
                grandTotal = grandTotal.add(finalPricePerItem.multiply(BigDecimal.valueOf(itemDto.getQuantity())));
            }

            order.setStatus("PREPARING");
            order.setTotalPrice(grandTotal);
            return orderRepository.save(order);

        } catch (FeignException e) {
            log.error("Order failed: {}", e.getMessage());
            order.setStatus("FAILED");
            orderRepository.save(order);
            throw new RuntimeException("Order failed due to service issue: " + e.getMessage());
        }
    }
}