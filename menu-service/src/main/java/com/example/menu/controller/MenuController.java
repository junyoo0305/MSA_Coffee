package com.example.menu.controller;

import com.example.menu.model.Menu;
import com.example.menu.model.OptionGroup;
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
        // (참고: 이 메뉴와 연결된 Stock, Option 등도 함께 삭제하는 로직이
        // MenuService에 추가되면 더 좋습니다. 지금은 메뉴만 삭제합니다.)
        return menuRepository.findById(id)
                .map(menu -> {
                    menuRepository.delete(menu);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}