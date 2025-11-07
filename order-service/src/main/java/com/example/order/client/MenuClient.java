package com.example.order.client;


import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

import java.awt.*;
import java.util.List;


@FeignClient(name = "menu-service")
public interface MenuClient {

    @GetMapping("/api/menu")
    List<Menu> getAllMenu();
}

