package com.example.menu.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // ★★★ 여기가 핵심입니다 ★★★
        // 윈도우 경로의 백슬래시(\)는 슬래시(/)로 바꿔야 합니다.
        // 앞에 'file:///'를 붙이고, 맨 뒤에도 '/'를 꼭 붙여주세요.
        String myLocalFolder = "file:///C:/Users/DU/Desktop/get/MSA_Coffee/uploads/";

        registry.addResourceHandler("/images/**")
                .addResourceLocations(myLocalFolder);
    }
}