package com.example.dao;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.entity.SysRole;
import com.example.mapper.SysRoleMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class SysRoleDao {

    private final SysRoleMapper roleMapper;

    public SysRole findById(Long id) {
        return roleMapper.selectById(id);
    }

    public Page<SysRole> page(long current, long size, String keyword) {
        LambdaQueryWrapper<SysRole> wrapper = new LambdaQueryWrapper<>();
        if (StringUtils.hasText(keyword)) {
            wrapper.and(w -> w.like(SysRole::getRoleName, keyword)
                    .or().like(SysRole::getRoleCode, keyword));
        }
        wrapper.orderByDesc(SysRole::getId);
        return roleMapper.selectPage(new Page<>(current, size), wrapper);
    }

    public List<SysRole> listAll() {
        return roleMapper.selectList(new LambdaQueryWrapper<SysRole>().orderByAsc(SysRole::getId));
    }

    public void save(SysRole role) {
        if (role.getId() == null) {
            roleMapper.insert(role);
        } else {
            roleMapper.updateById(role);
        }
    }

    public void deleteById(Long id) {
        roleMapper.deleteById(id);
    }
}
