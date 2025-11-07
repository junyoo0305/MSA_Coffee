package com.example.inventory.controller;

import com.example.inventory.model.Menu;
import com.example.inventory.service.MenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/menu")
public class MenuController {

    private final MenuService menuService;

    @GetMapping
    public List<Menu> findAll(){
        return menuService.getAllMenu();
    }

    @PostMapping
    public Menu createMenu(@RequestBody Menu menu){
        return menuService.createMenu(menu);
    }

    @GetMapping("/{id}")
    public Menu findMenuById(@PathVariable Long id){
        return menuService.getMenuById(id);
    }

}
