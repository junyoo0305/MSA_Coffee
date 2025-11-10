package com.example.stock.repository;

import com.example.stock.model.StockHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StockHistoryRepository  extends JpaRepository<StockHistory,Long> {
    List<StockHistory> findByStockIdOrderByTimestampDesc(Long stockId);
}
