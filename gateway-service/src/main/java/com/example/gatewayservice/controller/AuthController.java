package com.example.gatewayservice.controller;

import com.example.gatewayservice.dto.LoginRequest;
import com.example.gatewayservice.dto.LoginResponse;
import com.example.gatewayservice.dto.RegisterRequest;
import com.example.gatewayservice.entity.User;
import com.example.gatewayservice.repository.UserRepository;
import com.example.gatewayservice.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("/login")
    public Mono<ResponseEntity<LoginResponse>> login(@RequestBody LoginRequest loginRequest) {
        return Mono.just(authService.login(loginRequest))
                .map(response -> ResponseEntity.ok(response));
    }

    @PostMapping("/register")
    public Mono<ResponseEntity<Void>> register(@RequestBody RegisterRequest registerRequest) {
        return Mono.just(registerRequest)
                .flatMap(request -> {
                    if (userRepository.findByUsername(request.getUsername()).isPresent()) {
                        return Mono.just(ResponseEntity.badRequest().build());
                    }

                    User user = new User();
                    user.setUsername(request.getUsername());
                    user.setPassword(passwordEncoder.encode(request.getPassword()));
                    user.setEmail(request.getEmail());
                    user.setRole("USER");

                    userRepository.save(user);
                    return Mono.just(ResponseEntity.ok().build());
                });
    }
} 