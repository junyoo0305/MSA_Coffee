package com.example.gatewayservice.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

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

    @GetMapping("/changepassword")
    public String changepassword(Model model) {
        model.addAttribute("message", "비밀번호 변경");
        return "changepassword";
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

    @GetMapping("/stocks")
    public String stocks(Model model) {
        model.addAttribute("message", "재고 목록");
        return "stocks";
    }

    @GetMapping("/menus")
    public String menus(Model model) {
        model.addAttribute("message", "상품 관리");
        return "menus";
    }

    @GetMapping("/dashboard")
    public String dashboard(Model model) {
        model.addAttribute("message", "주문 현황");
        return "dashboard";
    }

    @GetMapping("/list")
    public String list(Model model) {
        model.addAttribute("message", "게시판");
        return "list";
    }

    // 글쓰기 페이지 추가
    @GetMapping("/write")
    public String write(Model model) {
        model.addAttribute("message", "글쓰기");
        return "write"; // write.html 페이지 반환
    }

    @GetMapping("/view/{id}")
    public String view(@PathVariable Long id, Model model) {
        // 여기에 실제 게시글을 조회하는 로직을 추가해야 합니다
        // 예를 들어, 서비스 클래스를 호출하여 게시글을 가져올 수 있습니다.

        // 임시로 id만 전달하는 경우
        model.addAttribute("postId", id);
        return "view"; // view.html 페이지 반환
    }

    @GetMapping("/edit/{id}")
    public String edit(@PathVariable Long id, Model model) {
        model.addAttribute("message", "수정");
        model.addAttribute("postId", id); // 수정하려는 게시글의 id를 뷰로 전달
        return "edit"; // edit.html 페이지 반환
    }
}