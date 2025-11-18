package com.example.menu.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // ★ 중요: 아래 path를 아까 복사한 '절대 경로'로 바꾸세요.
        // 윈도우 예시: "file:///C:/Users/내이름/프로젝트/uploads/"
        // (백슬래시 \ 대신 슬래시 / 사용, 끝에 / 꼭 붙이기, 앞에 file:/// 붙이기)

        String myAbsolutePath = "file:///C:/Users/DU/Desktop/get/MSA_Coffee/uploads/"; // <--- 여기에 본인 경로 붙여넣기

        registry.addResourceHandler("/images/**")
                .addResourceLocations(myAbsolutePath);
    }
}