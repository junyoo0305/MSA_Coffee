package com.example.menu.service;

import com.example.menu.client.StockServiceFeignClient;
import com.example.menu.dto.StockCreateRequest;
import com.example.menu.dto.StockCreateResponse;
import com.example.menu.model.Menu;
import com.example.menu.model.Option;
import com.example.menu.model.OptionGroup;
import com.example.menu.repository.MenuRepository;
import com.example.menu.repository.OptionGroupRepository; // 1. 임포트
import com.example.menu.repository.OptionRepository; // 1. 임포트
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal; // 1. 임포트

@Service
@RequiredArgsConstructor
public class MenuService {

    private final MenuRepository menuRepository;
    private final StockServiceFeignClient stockServiceFeignClient;

    // 2. Repository 2개 주입받기
    private final OptionGroupRepository optionGroupRepository;
    private final OptionRepository optionRepository;

    @Transactional
    public Menu createMenu(String name, String description, BigDecimal price) {
        // 1. Menu 엔티티 생성 및 저장 (아직 stockId는 null)
        Menu menu = new Menu();
        menu.setName(name);
        menu.setDescription(description);
        menu.setPrice(price);
        Menu savedMenu = menuRepository.save(menu); // 1차 저장 (menu ID 생성)

        // 2. stock-service에 재고 생성 요청 (초기 재고 0)
        StockCreateRequest stockRequest = new StockCreateRequest(name, description, 0);
        StockCreateResponse stockResponse = stockServiceFeignClient.createStock(stockRequest);

        // 3. ★★★ 이 메뉴에 대한 기본 옵션 생성 (새로 추가된 로직) ★★★
        createStandardOptionsForMenu(savedMenu);
        // ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★

        // 4. 반환받은 stockId를 Menu 엔티티에 업데이트
        savedMenu.setStockId(stockResponse.getId());
        return menuRepository.save(savedMenu); // 2차 저장 (stockId 업데이트)
    }

    // 4. ★★★ 이 메뉴에 대한 표준 옵션을 생성하는 헬퍼 메소드 (신규 추가) ★★★
    private void createStandardOptionsForMenu(Menu menu) {
        // --- "온도" 옵션 그룹 생성 ---
        OptionGroup tempGroup = new OptionGroup();
        tempGroup.setName("온도");
        tempGroup.setMenu(menu); // 이 옵션 그룹을 방금 생성된 메뉴에 연결
        optionGroupRepository.save(tempGroup); // DB에 저장 (group_id 생성)

        // "Hot" 옵션 생성
        Option hot = new Option();
        hot.setName("Hot");
        hot.setAdditionalPrice(BigDecimal.ZERO);
        hot.setOptionGroup(tempGroup); // "온도" 그룹에 연결
        optionRepository.save(hot);

        // "Ice" 옵션 생성
        Option ice = new Option();
        ice.setName("Ice");
        ice.setAdditionalPrice(BigDecimal.ZERO);
        ice.setOptionGroup(tempGroup); // "온도" 그룹에 연결
        optionRepository.save(ice);

        // --- "사이즈" 옵션 그룹 생성 ---
        OptionGroup sizeGroup = new OptionGroup();
        sizeGroup.setName("사이즈");
        sizeGroup.setMenu(menu); // 이 옵션 그룹을 방금 생성된 메뉴에 연결
        optionGroupRepository.save(sizeGroup); // DB에 저장 (group_id 생성)

        // "Regular" 옵션 생성
        Option regular = new Option();
        regular.setName("Regular");
        regular.setAdditionalPrice(BigDecimal.ZERO);
        regular.setOptionGroup(sizeGroup); // "사이즈" 그룹에 연결
        optionRepository.save(regular);

        // "Size Up" 옵션 생성
        Option sizeUp = new Option();
        sizeUp.setName("Size Up");
        sizeUp.setAdditionalPrice(new BigDecimal(500)); // 500원 추가
        sizeUp.setOptionGroup(sizeGroup); // "사이즈" 그룹에 연결
        optionRepository.save(sizeUp);
    }
}