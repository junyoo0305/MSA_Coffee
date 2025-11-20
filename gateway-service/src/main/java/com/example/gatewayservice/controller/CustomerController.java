package com.example.gatewayservice.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class CustomerController {

    // /customers 경로로 요청이 들어오면 customers.html을 반환
    @GetMapping("/customers")
    public String showCustomers() {
        // 이 메서드는 customers.html을 반환합니다.
        return "customers";  // 'src/main/resources/templates/customers.html' 파일을 렌더링
    }
}
