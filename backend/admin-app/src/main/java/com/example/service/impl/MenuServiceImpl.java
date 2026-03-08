package com.example.service.impl;

import com.example.common.exception.BusinessException;
import com.example.dao.SysMenuDao;
import com.example.dao.SysRoleMenuDao;
import com.example.dao.SysUserRoleDao;
import com.example.dto.MenuSaveDTO;
import com.example.entity.SysMenu;
import com.example.entity.SysUserRole;
import com.example.service.MenuService;
import com.example.vo.MenuVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MenuServiceImpl implements MenuService {

    private final SysMenuDao menuDao;
    private final SysUserRoleDao userRoleDao;
    private final SysRoleMenuDao roleMenuDao;

    @Override
    public List<MenuVO> listCurrentUserMenus(Long userId) {
        List<SysUserRole> userRoles = userRoleDao.listByUserId(userId);
        if (CollectionUtils.isEmpty(userRoles)) {
            return Collections.emptyList();
        }
        List<Long> roleIds = userRoles.stream().map(SysUserRole::getRoleId).toList();
        var roleMenus = roleMenuDao.listByRoleIds(roleIds);
        if (CollectionUtils.isEmpty(roleMenus)) {
            return Collections.emptyList();
        }
        Set<Long> menuIds = roleMenus.stream().map(rm -> rm.getMenuId()).collect(Collectors.toSet());
        List<SysMenu> menus = menuDao.listByIds(menuIds);
        return buildMenuTree(menus);
    }

    @Override
    public List<SysMenu> listAllMenus() {
        return menuDao.listAll();
    }

    @Override
    public void saveMenu(MenuSaveDTO dto) {
        SysMenu menu = new SysMenu();
        menu.setParentId(dto.getParentId());
        menu.setMenuName(dto.getMenuName());
        menu.setPath(dto.getPath());
        menu.setComponent(dto.getComponent());
        menu.setIcon(dto.getIcon());
        menu.setSort(dto.getSort() == null ? 0 : dto.getSort());
        menu.setMenuType(dto.getMenuType());
        menu.setPerms(dto.getPerms());

        if (dto.getId() == null) {
            menuDao.save(menu);
        } else {
            if (menuDao.findById(dto.getId()) == null) {
                throw new BusinessException("菜单不存在");
            }
            menu.setId(dto.getId());
            menuDao.save(menu);
        }
    }

    @Override
    public void deleteMenu(Long id) {
        menuDao.deleteById(id);
    }

    private List<MenuVO> buildMenuTree(List<SysMenu> menus) {
        Map<Long, MenuVO> map = new HashMap<>();
        for (SysMenu m : menus) {
            MenuVO vo = new MenuVO();
            vo.setId(m.getId());
            vo.setParentId(m.getParentId());
            vo.setMenuName(m.getMenuName());
            vo.setPath(m.getPath());
            vo.setComponent(m.getComponent());
            vo.setIcon(m.getIcon());
            vo.setSort(m.getSort());
            vo.setMenuType(m.getMenuType());
            vo.setPerms(m.getPerms());
            map.put(vo.getId(), vo);
        }

        List<MenuVO> roots = new ArrayList<>();
        for (MenuVO vo : map.values()) {
            if (vo.getParentId() == 0) {
                roots.add(vo);
                continue;
            }
            MenuVO parent = map.get(vo.getParentId());
            if (parent != null) {
                parent.getChildren().add(vo);
            }
        }

        roots.sort(Comparator.comparing(MenuVO::getSort, Comparator.nullsFirst(Integer::compareTo)));
        return roots;
    }
}
