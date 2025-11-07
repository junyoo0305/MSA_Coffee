package com.example.order.service;

import com.example.order.client.InventoryClient;
import com.example.order.client.MenuClient;
import com.example.order.model.Order;
import com.example.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final MenuClient menuClient;
    private final InventoryClient inventoryClient;

    public List<Menu> getMenus() {
        // menu-service의 /menus API 호출 (Feign 자동 처리)
        return menuClient.getAllMenu();
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order createOrder(String menuId, int quantity) {
        // menuId를 Long으로 바꿔야 하는 경우가 있다면 이때 변환
        Long parsedMenuId = Long.parseLong(menuId);

        inventoryClient.decreaseStock(menuId, quantity);

        Order order = new Order();
        order.setMenuId(parsedMenuId);
        order.setQuantity(quantity);
        order.setStatus(Order.Status.CONFIRMED);
        return orderRepository.save(order);
    }

}
