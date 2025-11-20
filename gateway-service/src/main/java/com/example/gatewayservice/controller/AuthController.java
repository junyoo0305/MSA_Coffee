package com.example.gatewayservice.controller;

import com.example.gatewayservice.dto.ChangePasswordRequest;
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

    // 비밀번호 변경 요청
    @PostMapping("/changepassword")
    public Mono<ResponseEntity<String>> changePassword(@RequestBody ChangePasswordRequest request) {
        String username = request.getUsername();  // 사용자가 제공한 사용자명

        return Mono.justOrEmpty(userRepository.findByUsername(username))
                .switchIfEmpty(Mono.error(new RuntimeException("사용자를 찾을 수 없습니다.")))
                .flatMap(user -> {
                    // 현재 비밀번호 확인
                    if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
                        return Mono.just(ResponseEntity.badRequest().body("현재 비밀번호가 일치하지 않습니다."));
                    }

                    // 새 비밀번호가 기존 비밀번호와 같은지 확인
                    if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
                        return Mono.just(ResponseEntity.badRequest().body("기존 비밀번호가 같습니다. 다른 비밀번호로 변경해주세요."));
                    }

                    // 새 비밀번호로 업데이트
                    user.setPassword(passwordEncoder.encode(request.getNewPassword()));
                    return Mono.fromRunnable(() -> userRepository.save(user))
                            .then(Mono.just(ResponseEntity.ok().body("비밀번호 변경 성공")));
                });
    }
} 