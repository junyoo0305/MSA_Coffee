package com.example.gatewayservice.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {

    @GetMapping("/")
    public String index(Model model) {
        model.addAttribute("message", "MSA 프로젝트에 오신 것을 환영합니다");
        return "index";
    }

    @GetMapping("/login")
    public String login(Model model) {
        model.addAttribute("message", "로그인");
        return "login";
    }

    @GetMapping("/register")
    public String register(Model model) {
        model.addAttribute("message", "회원 가입");
        return "register";
    }

    @GetMapping("/products")
    public String products(Model model) {
        model.addAttribute("message", "상품 목록");
        return "products";
    }

    @GetMapping("/orders")
    public String orders(Model model) {
        model.addAttribute("message", "주문 목록");
        return "orders";
    }

    @GetMapping("/admin")
    public String admin(Model model) {
        model.addAttribute("message", "관리자 페이지");
        return "admin";
    }

    @GetMapping("/order-test")
    public String orderTest() {
        return "order-test";
    }
} 