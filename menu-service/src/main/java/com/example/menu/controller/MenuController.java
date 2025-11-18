package com.example.menu.controller;

import com.example.menu.model.Menu;
import com.example.menu.model.OptionGroup;
import com.example.menu.repository.MenuRepository;
import com.example.menu.service.MenuService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;


@RestController
@RequestMapping("/api/menus")
@RequiredArgsConstructor
@CrossOrigin("*")
public class MenuController {

    private final MenuService menuService;
    private final MenuRepository menuRepository;

    @PostMapping(consumes = "multipart/form-data") // ★ multipart 타입 지정
    public ResponseEntity<Menu> createMenu(
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("price") BigDecimal price,
            @RequestParam(value = "file", required = false) MultipartFile file // 파일 받기
    ) {
        Menu menu = menuService.createMenu(name, description, price, file);
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

    @GetMapping("/{id}/options")
    public ResponseEntity<List<OptionGroup>> getMenuOptions(@PathVariable Long id) {
        // MenuRepository에서 OptionGroups를 Eager/Fetch Join으로 가져오는 쿼리 필요
        // (간단하게는 menuRepository.findById(id)로직으로 처리)

        Menu menu = menuRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Menu not found"));

        // Lazy 로딩을 위해 옵션 그룹을 한번 호출
        menu.getOptionGroups().size();

        return ResponseEntity.ok(menu.getOptionGroups());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMenu(@PathVariable Long id) {
        try {
            // 1. Controller는 Service의 메소드를 호출만 하도록 변경
            menuService.deleteMenu(id);
            return ResponseEntity.ok().<Void>build();
        } catch (RuntimeException e) { // (MenuService에서 Menu not found 예외가 터졌을 때)
            return ResponseEntity.notFound().build();
        }
    }
}