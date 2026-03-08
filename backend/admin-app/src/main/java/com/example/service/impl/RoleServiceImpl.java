package com.example.service.impl;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.common.exception.BusinessException;
import com.example.dao.SysRoleDao;
import com.example.dao.SysRoleMenuDao;
import com.example.dao.SysUserRoleDao;
import com.example.dto.RoleSaveDTO;
import com.example.entity.SysRole;
import com.example.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {

    private final SysRoleDao roleDao;
    private final SysRoleMenuDao roleMenuDao;
    private final SysUserRoleDao userRoleDao;

    @Override
    public Page<SysRole> pageRoles(long current, long size, String keyword) {
        return roleDao.page(current, size, keyword);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void saveRole(RoleSaveDTO dto) {
        SysRole role = new SysRole();
        role.setRoleCode(dto.getRoleCode());
        role.setRoleName(dto.getRoleName());
        role.setRemark(dto.getRemark());

        if (dto.getId() == null) {
            roleDao.save(role);
            roleMenuDao.resetMenus(role.getId(), dto.getMenuIds());
        } else {
            SysRole exist = roleDao.findById(dto.getId());
            if (exist == null) {
                throw new BusinessException("角色不存在");
            }
            role.setId(dto.getId());
            roleDao.save(role);
            roleMenuDao.resetMenus(dto.getId(), dto.getMenuIds());
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteRole(Long id) {
        roleDao.deleteById(id);
        roleMenuDao.deleteByRoleId(id);
        userRoleDao.deleteByRoleId(id);
    }

    @Override
    public List<SysRole> listAllRoles() {
        return roleDao.listAll();
    }

    @Override
    public List<Long> listRoleMenuIds(Long roleId) {
        return roleMenuDao.listMenuIdsByRoleId(roleId);
    }
}
