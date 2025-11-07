package com.example.gatewayservice.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.reactive.result.view.Rendering;
import reactor.core.publisher.Mono;

@Controller
public class H2ConsoleController {

    @GetMapping("/h2-console")
    public Mono<Rendering> h2Console() {
        return Mono.just(Rendering.view("h2-console").build());
    }
} 