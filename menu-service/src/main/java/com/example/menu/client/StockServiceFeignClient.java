package com.example.menu.client;

import com.example.menu.dto.StockCreateRequest;
import com.example.menu.dto.StockCreateResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

// "stock-service"는 Eureka에 등록된 이름
@FeignClient(name = "stock-service") // <-- 유레카에 등록되어있다면 이 인터페이스 구현체를 자동으로 생성
public interface StockServiceFeignClient {


    // 기존 stock-service의 StockController.createStock()과 시그니처를 맞춤
    // StockController에 만들어둔 API 경로와 정확히 일치해야 함
    @PostMapping("/api/stocks")
    StockCreateResponse createStock(@RequestBody StockCreateRequest request);
}