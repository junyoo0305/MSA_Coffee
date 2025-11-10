package com.example.stock.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "STOCKHISTORY")
public class StockHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long stockId;
    private String stockName;
    private Integer changeAmount;
    private String reason;
    private LocalDateTime timestamp;

    public StockHistory(Long stockId, String stockName, Integer changeAmount, String reason) {
        this.stockId = stockId;
        this.stockName = stockName;
        this.changeAmount = changeAmount;
        this.reason = reason;
        this.timestamp = LocalDateTime.now();
    }

    public StockHistory() {

    }
}
