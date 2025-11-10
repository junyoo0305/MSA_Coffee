package com.example.order.client;

import com.example.order.dto.MenuItemResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "menu-service")
public interface MenuServiceFeignClient {

    @GetMapping("/api/menus/{id}")
    MenuItemResponse getMenuById(@PathVariable("id") Long id);
}