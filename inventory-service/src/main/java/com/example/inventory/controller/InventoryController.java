package com.example.inventory.controller;

import com.example.inventory.model.Inventory;
import com.example.inventory.repository.InventoryRepository;
import com.example.inventory.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/inventory")
public class InventoryController {

    private final InventoryService inventoryService;
    private final InventoryRepository inventoryRepository;

    @GetMapping
    public List<Inventory> getInventory(){
        return inventoryRepository.findAll();
    }

    // 특정 상품 재고 조회
    @GetMapping("/{menuId}")
    public Inventory getInventoryByMenuId(@PathVariable String menuId) {
        return inventoryRepository.findByMenuId(menuId)
                .orElseThrow(() -> new RuntimeException("해당 메뉴의 재고가 없습니다: " + menuId));
    }

    // 재고 추가
    @PostMapping("/add")
    public Inventory addInventory(@RequestBody Inventory inventory) {
        return inventoryRepository.save(inventory);
    }

    // 재고 감소 (예: 주문 시 차감)
    @PutMapping("/decrease/{menuId}")
    public Inventory decreaseStock(@PathVariable String menuId, @RequestParam int quantity) {
        Inventory inv = inventoryRepository.findByMenuId(menuId)
                .orElseThrow(() -> new RuntimeException("재고를 찾을 수 없습니다."));
        if (inv.getStock() < quantity) {
            throw new RuntimeException("재고 부족");
        }
        inv.setStock(inv.getStock() - quantity);
        return inventoryRepository.save(inv);
    }

    @PostMapping("/deduct")
    public Inventory deduct(@RequestParam Long id, @RequestParam int stock) {
        return inventoryService.deduct(id, stock);
    }
}
