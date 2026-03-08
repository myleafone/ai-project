package com.example.dao;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.example.entity.SysMenu;
import com.example.mapper.SysMenuMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.Collections;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class SysMenuDao {

    private final SysMenuMapper menuMapper;

    public SysMenu findById(Long id) {
        return menuMapper.selectById(id);
    }

    public List<SysMenu> listAll() {
        return menuMapper.selectList(new LambdaQueryWrapper<SysMenu>().orderByAsc(SysMenu::getSort));
    }

    public List<SysMenu> listByIds(Collection<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return Collections.emptyList();
        }
        return menuMapper.selectList(new LambdaQueryWrapper<SysMenu>()
                .in(SysMenu::getId, ids)
                .orderByAsc(SysMenu::getSort));
    }

    public void save(SysMenu menu) {
        if (menu.getId() == null) {
            menuMapper.insert(menu);
        } else {
            menuMapper.updateById(menu);
        }
    }

    public void deleteById(Long id) {
        menuMapper.deleteById(id);
    }
}
