package com.example.dao;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.example.entity.SysUserRole;
import com.example.mapper.SysUserRoleMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.Collections;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class SysUserRoleDao {

    private final SysUserRoleMapper userRoleMapper;

    public void resetRoles(Long userId, List<Long> roleIds) {
        userRoleMapper.delete(new LambdaUpdateWrapper<SysUserRole>().eq(SysUserRole::getUserId, userId));
        if (roleIds == null || roleIds.isEmpty()) {
            return;
        }
        for (Long roleId : roleIds) {
            SysUserRole ur = new SysUserRole();
            ur.setUserId(userId);
            ur.setRoleId(roleId);
            userRoleMapper.insert(ur);
        }
    }

    public List<Long> listRoleIdsByUserId(Long userId) {
        if (userId == null) {
            return Collections.emptyList();
        }
        return userRoleMapper.selectList(new LambdaQueryWrapper<SysUserRole>().eq(SysUserRole::getUserId, userId))
                .stream()
                .map(SysUserRole::getRoleId)
                .toList();
    }

    public void deleteByUserId(Long userId) {
        userRoleMapper.delete(new LambdaUpdateWrapper<SysUserRole>().eq(SysUserRole::getUserId, userId));
    }

    public void deleteByRoleId(Long roleId) {
        userRoleMapper.delete(new LambdaUpdateWrapper<SysUserRole>().eq(SysUserRole::getRoleId, roleId));
    }

    public List<SysUserRole> listByUserId(Long userId) {
        return userRoleMapper.selectList(new LambdaQueryWrapper<SysUserRole>().eq(SysUserRole::getUserId, userId));
    }
}
