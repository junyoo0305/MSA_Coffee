package com.example.stock.service;

import com.example.stock.exception.InsufficientStockException;
import com.example.stock.model.Stock;
import com.example.stock.model.StockHistory;
import com.example.stock.repository.StockHistoryRepository;
import com.example.stock.repository.StockRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.naming.InsufficientResourcesException;

@Service
@RequiredArgsConstructor
public class StockService {

    private final StockRepository stockRepository;


    private final StockHistoryRepository stockHistoryRepository;

    // @Transactional => DB 오류가 나면 작업 전체가 롤백되어 데이터가 꼬이는 것을 방지
    @Transactional
    public void decreaseStock(Long stockId, Integer quantity){
        // 1. DB에서 재고를 찾음 (SELECT)
        Stock stock = stockRepository.findById(stockId)
                .orElseThrow(() -> new RuntimeException("상품을 찾을 수 없습니다."));

        // 2. 재고 수량 확인 (비즈니스 로직)
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
        // 3. 재고 차감 (UPDATE)
        stock.setStock(stock.getStock() - quantity);
        // (stockRepository.save(stock)을 호출하지 않아도,
        //  @Transactional 덕분에 이 메소드가 끝나면 변경된 'stock' 객체가 DB에 자동 반영됩니다.)
    }
}


