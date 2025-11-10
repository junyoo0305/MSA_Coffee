package com.example.menu.controller;

import com.example.menu.model.Menu;
import com.example.menu.repository.MenuRepository;
import com.example.menu.service.MenuService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/menus")
@RequiredArgsConstructor
@CrossOrigin("*")
public class MenuController {

    private final MenuService menuService;
    private final MenuRepository menuRepository;

    @PostMapping
    public ResponseEntity<Menu> createMenu(@RequestBody MenuCreateRequest request) {
        Menu menu = menuService.createMenu(request.getName(), request.getDescription(), request.getPrice());
        return ResponseEntity.ok(menu);
    }

    @GetMapping
    public List<Menu> getAllMenus() {
        return menuRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Menu> getMenuById(@PathVariable Long id) {
        return menuRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // DTO
    @Data
    static class MenuCreateRequest {
        private String name;
        private String description;
        private BigDecimal price;
    }
}