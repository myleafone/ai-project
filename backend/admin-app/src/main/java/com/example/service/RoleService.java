package com.example.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.dto.RoleSaveDTO;
import com.example.entity.SysRole;

public interface RoleService {
    Page<SysRole> pageRoles(long current, long size, String keyword);

    void saveRole(RoleSaveDTO dto);

    void deleteRole(Long id);

    java.util.List<SysRole> listAllRoles();

    java.util.List<Long> listRoleMenuIds(Long roleId);
}
