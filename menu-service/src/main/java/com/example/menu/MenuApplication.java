package com.example.menu;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class MenuApplication {
    public static void main(String[] args) { SpringApplication.run(MenuApplication.class, args);
    }
} 