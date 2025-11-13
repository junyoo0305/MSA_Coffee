package com.example.order.client;

import com.example.order.dto.MenuItemResponse;
import lombok.Data;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@FeignClient(name = "menu-service")
public interface MenuServiceFeignClient {

    @GetMapping("/api/menus/{id}")
    MenuItemResponse getMenuById(@PathVariable("id") Long id);

    @PostMapping("/api/options/details")
    List<OptionDetailResponse> getOptionDetails(@RequestBody List<Long> optionIds);
}