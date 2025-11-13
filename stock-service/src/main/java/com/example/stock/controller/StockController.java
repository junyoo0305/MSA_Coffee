package com.example.stock.controller;

import com.example.stock.dto.StockDecreaseRequest;
import com.example.stock.exception.InsufficientStockException;
import com.example.stock.model.Stock;
import com.example.stock.model.StockHistory;
import com.example.stock.repository.StockHistoryRepository;
import com.example.stock.repository.StockRepository;
import com.example.stock.service.StockService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stocks")
@RequiredArgsConstructor
@CrossOrigin("*")
public class StockController {

    private final StockRepository stockRepository;
    private final StockHistoryRepository historyRepository;
    private final StockService stockService;

    @GetMapping
    public List<Stock> getAllStocks() {
        return stockRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Stock> getStockById(@PathVariable Long id) {
        return stockRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 1. 메뉴 서비스가 호출하는 초기 재고(0개) 생성 API
    @PostMapping
    public Stock createStock(@RequestBody Stock stock) {
        //새 상품DB 저장
        Stock savedStock = stockRepository.save(stock);

        //초기 재고 이력 생성
        StockHistory history = new StockHistory(
                savedStock.getId(),
                savedStock.getName(),
                savedStock.getStock(),
                "상품 추가"
        );
        historyRepository.save(history); //이력 저장
        return savedStock;
    }

    // 2. 메뉴 관리 페이지(menus.js)가 호출하는 재고 수동 수정 API
    @PutMapping("/{id}")
    public ResponseEntity<Stock> updateStock(@PathVariable Long id, @RequestBody Stock stockDetails) {

        // 1. DB에서 id로 기존 'Stock' 객체를 찾습니다.
        return stockRepository.findById(id)
                .map(existingStock -> {

                    int oldStock = existingStock.getStock();
                    int newStock = stockDetails.getStock();
                    int change = newStock - oldStock;

                    if (change != 0) {
                        StockHistory history = new StockHistory(
                                existingStock.getId(),
                                existingStock.getName(),
                                change,
                                "수동 수정"
                        );
                        historyRepository.save(history);
                    }
                    existingStock.setName(stockDetails.getName());
                    existingStock.setDescription(stockDetails.getDescription());
                    existingStock.setStock(newStock);

                    return ResponseEntity.ok(stockRepository.save(existingStock));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // 3. 주문 서비스(order-service)가 호출하는 재고 차감 API
    @PostMapping("/decrease")
    public ResponseEntity<String> decreaseStock(@RequestBody StockDecreaseRequest request) { // 2. <Void>를 <String>으로 변경
        try {
            stockService.decreaseStock(request.getStockId(), request.getQuantity());
            return ResponseEntity.ok().body("성공적으로 차감되었습니다.");
        } catch (InsufficientStockException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    // 4. 재고 삭제 API
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStock(@PathVariable Long id) {
        return stockRepository.findById(id)
                .map(stock -> {
                    stockRepository.delete(stock);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }


    @GetMapping("/{id}/history")
    public ResponseEntity<List<StockHistory>> getStockHistory(@PathVariable Long id) {
        //ID를 기준으로 이력을 최신순으로 검색
        List<StockHistory> historyList = historyRepository.findByStockIdOrderByTimestampDesc(id);
        //검색된 리스트를 반환 (200 OK)
        return ResponseEntity.ok(historyList);
    }
} 