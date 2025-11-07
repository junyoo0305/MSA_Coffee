package com.example.inventory.service;

import com.example.inventory.model.Inventory;
import com.example.inventory.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class InventoryService {
    private final InventoryRepository inventoryRepository;

    public Inventory deduct(Long id, int stock){
        Inventory inventory = inventoryRepository.findById(id)
                .orElseThrow(()->new RuntimeException("재고 없음"));

        if(inventory.getStock() < stock){
            throw new RuntimeException("재고 부족");
        }

        inventory.setStock(inventory.getStock() - stock);
        return inventoryRepository.save(inventory);
    }
}
