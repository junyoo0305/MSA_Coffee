package com.example.menu.service;

import com.example.menu.client.StockServiceFeignClient;
import com.example.menu.dto.StockCreateRequest;
import com.example.menu.dto.StockCreateResponse;
import com.example.menu.model.Menu;
import com.example.menu.repository.MenuRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class MenuService {

    private final MenuRepository menuRepository;
    private final StockServiceFeignClient stockServiceFeignClient;

    @Transactional
    public Menu createMenu(String name, String description, BigDecimal price) {
        // 1. Menu 엔티티 생성 및 저장 (아직 stockId는 null)
        Menu menu = new Menu();
        menu.setName(name);
        menu.setDescription(description);
        menu.setPrice(price);
        Menu savedMenu = menuRepository.save(menu);

        // 2. stock-service에 재고 생성 요청 (초기 재고 0)
        StockCreateRequest stockRequest = new StockCreateRequest(name, description, 0);
        StockCreateResponse stockResponse = stockServiceFeignClient.createStock(stockRequest);

        // 3. 반환받은 stockId를 Menu 엔티티에 업데이트
        savedMenu.setStockId(stockResponse.getId());
        return menuRepository.save(savedMenu);
    }
}