package com.example.stock.service;

import com.example.stock.exception.InsufficientStockException;
import com.example.stock.model.Stock;
import com.example.stock.model.StockHistory;
import com.example.stock.repository.StockHistoryRepository;
import com.example.stock.repository.StockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.naming.InsufficientResourcesException;

@Service
public class StockService {
    @Autowired
    private StockRepository stockRepository;

    @Autowired
    private StockHistoryRepository stockHistoryRepository;

    @Transactional
    public void decreaseStock(Long stockId, Integer quantity){
        Stock stock = stockRepository.findById(stockId)
                .orElseThrow(() -> new RuntimeException("상품을 찾을 수 없습니다."));

        if (stock.getStock() < quantity){
            throw new InsufficientStockException("재고가 부족합니다.");
        }
        // (수량이 0이 아니라는 가정 하에)
        StockHistory history = new StockHistory(
                stock.getId(),
                stock.getName(),
                -quantity, // "차감"이므로 음수(-)로 저장
                "ORDER_DECREASE" // 사유: 주문으로 인한 차감
        );
        stockHistoryRepository.save(history);
        stock.setStock(stock.getStock() - quantity);
    }
}


