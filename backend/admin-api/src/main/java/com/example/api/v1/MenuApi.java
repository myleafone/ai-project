package com.example.api.v1;

import com.example.common.result.Result;
import com.example.dto.MenuSaveDTO;
import com.example.entity.SysMenu;
import com.example.vo.MenuVO;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api/menus")
public interface MenuApi {

    @GetMapping("/current")
    Result<List<MenuVO>> currentMenus();

    @GetMapping
    Result<List<SysMenu>> listAll();

    @PostMapping
    Result<Void> save(@Valid @RequestBody MenuSaveDTO dto);

    @DeleteMapping("/{id}")
    Result<Void> delete(@PathVariable Long id);
}
