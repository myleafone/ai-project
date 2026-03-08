package com.example.service;

import com.example.dto.MenuSaveDTO;
import com.example.entity.SysMenu;
import com.example.vo.MenuVO;

import java.util.List;

public interface MenuService {
    List<MenuVO> listCurrentUserMenus(Long userId);

    List<SysMenu> listAllMenus();

    void saveMenu(MenuSaveDTO dto);

    void deleteMenu(Long id);
}
