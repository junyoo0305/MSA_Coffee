package com.example.inventory.service;

import com.example.inventory.model.Menu;
import com.example.inventory.repository.MenuRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MenuService {
    private final MenuRepository menuRepository;

    public List<Menu> getAllMenu(){
        return menuRepository.findAll();
    }

    public Menu getMenuById(Long id){
        return menuRepository.findById(id).orElseThrow(() -> new RuntimeException("메뉴 없음"));
    }

    public Menu createMenu(Menu menu){
        return menuRepository.save(menu);
    }
}
