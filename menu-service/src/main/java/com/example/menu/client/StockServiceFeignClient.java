package com.example.menu.client;

import com.example.menu.dto.StockCreateRequest;
import com.example.menu.dto.StockCreateResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

// "stock-service"는 Eureka에 등록된 이름
@FeignClient(name = "stock-service")
public interface StockServiceFeignClient {

    // 기존 stock-service의 StockController.createStock()과 시그니처를 맞춤
    @PostMapping("/api/stocks")
    StockCreateResponse createStock(@RequestBody StockCreateRequest request);
}