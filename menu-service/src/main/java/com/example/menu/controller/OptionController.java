package com.example.menu.controller;

import com.example.menu.model.Option;
import com.example.menu.repository.OptionRepository; // OptionRepository 생성 필요
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/options")
@RequiredArgsConstructor
@CrossOrigin("*") // CORS 허용
public class OptionController {

    private final OptionRepository optionRepository;

    // ORDER-SERVICE가 호출할 API
    // [1, 4] -> ["Ice", "Size Up"] 정보 반환
    @PostMapping("/details")
    public List<Option> getOptionDetails(@RequestBody List<Long> optionIds) {
        // [1, 4] 같은 ID 목록을 받으면
        // 해당 Option 엔티티 목록을 찾아서 반환합니다.
        return optionRepository.findAllById(optionIds);
    }
}