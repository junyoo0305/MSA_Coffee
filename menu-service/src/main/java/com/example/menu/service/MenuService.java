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
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal; // 1. 임포트
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MenuService {

    // ★ 파일 업로드 경로 (프로젝트 루트/uploads)
    private final String UPLOAD_DIR = "./uploads/";

    private final MenuRepository menuRepository;
    private final StockServiceFeignClient stockServiceFeignClient;

    // 2. Repository 2개 주입받기
    private final OptionGroupRepository optionGroupRepository;
    private final OptionRepository optionRepository;

    @Transactional
    public Menu createMenu(String name, String description, BigDecimal price, MultipartFile file) {
        // 1. 이미지 파일 저장 처리
        String imagePath = null;
        if (file != null && !file.isEmpty()) {
            try {
                // 폴더가 없으면 생성
                Path uploadPath = Paths.get(UPLOAD_DIR);
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }

                // 파일명 중복 방지를 위해 UUID 사용
                String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
                Path filePath = uploadPath.resolve(fileName);
                Files.copy(file.getInputStream(), filePath);

                // DB에 저장할 접근 URL (/images/파일명)
                imagePath = "/images/" + fileName;

            } catch (IOException e) {
                throw new RuntimeException("이미지 저장 실패: " + e.getMessage());
            }
        }

        // 2. 메뉴 생성
        Menu menu = new Menu();
        menu.setName(name);
        menu.setDescription(description);
        menu.setPrice(price);
        menu.setImageUrl(imagePath); // ★ 이미지 경로 저장

        Menu savedMenu = menuRepository.save(menu);

        // 3. 재고 생성 (기존 로직)
        StockCreateRequest stockRequest = new StockCreateRequest(name, description, 0);
        StockCreateResponse stockResponse = stockServiceFeignClient.createStock(stockRequest);

        // 4. 옵션 생성 (기존 로직)
        createStandardOptionsForMenu(savedMenu);

        savedMenu.setStockId(stockResponse.getId());
        return menuRepository.save(savedMenu);
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

    @Transactional
    public void deleteMenu(Long menuId) {
        // 1. 메뉴 정보 조회
        Menu menu = menuRepository.findById(menuId)
                .orElseThrow(() -> new RuntimeException("Menu not found with id: " + menuId));

        Long stockId = menu.getStockId();

        // 2. (JPA Cascade) 메뉴를 삭제합니다.
        //    Menu.java의 @OneToMany(cascade = CascadeType.ALL) 설정 덕분에
        //    이 메뉴에 연결된 OptionGroups와 Options가 자동으로 함께 삭제됩니다.
        menuRepository.delete(menu);

        // 3. (Feign Call) STOCK-SERVICE에 재고 삭제를 요청합니다.
        if (stockId != null) {
            try {
                stockServiceFeignClient.deleteStock(stockId);
            } catch (Exception e) {
                // Feign 호출이 실패해도 메뉴 삭제는 롤백되지 않도록 처리
                // (더 복잡한 Saga 패턴을 쓰지 않는 이상, 일단 로그만 남깁니다)
                System.err.println("Failed to delete stock with id: " + stockId + ". Error: " + e.getMessage());
                // (선택) 여기서 커스텀 예외를 발생시켜 롤백시킬 수도 있습니다.
            }
        }
    }
}