package com.example.order.client;

import com.example.order.dto.StockDecreaseRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "stock-service")
public interface StockServiceFeignClient {

    // 기존 stock-service의 StockController.decreaseStock()과 시그니처를 맞춤
    @PostMapping("/api/stocks/decrease")
    ResponseEntity<String> decreaseStock(@RequestBody StockDecreaseRequest request);
}