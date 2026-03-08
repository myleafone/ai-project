package com.example.controller;

import com.example.api.v1.MenuApi;
import com.example.common.result.Result;
import com.example.dto.MenuSaveDTO;
import com.example.entity.SysMenu;
import com.example.security.AuthContext;
import com.example.service.MenuService;
import com.example.vo.MenuVO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class MenuController implements MenuApi {

    private final MenuService menuService;

    @Override
    public Result<List<MenuVO>> currentMenus() {
        return Result.success(menuService.listCurrentUserMenus(AuthContext.getUserId()));
    }

    @Override
    public Result<List<SysMenu>> listAll() {
        return Result.success(menuService.listAllMenus());
    }

    @Override
    public Result<Void> save(@Valid @RequestBody MenuSaveDTO dto) {
        menuService.saveMenu(dto);
        return Result.success("操作成功", null);
    }

    @Override
    public Result<Void> delete(@PathVariable Long id) {
        menuService.deleteMenu(id);
        return Result.success("删除成功", null);
    }
}
