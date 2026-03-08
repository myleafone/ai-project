package com.example.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.api.v1.RoleApi;
import com.example.common.result.Result;
import com.example.dto.RoleSaveDTO;
import com.example.entity.SysRole;
import com.example.service.RoleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class RoleController implements RoleApi {

    private final RoleService roleService;

    @Override
    public Result<Page<SysRole>> page(@RequestParam(defaultValue = "1") long current,
                                      @RequestParam(defaultValue = "10") long size,
                                      @RequestParam(required = false) String keyword) {
        return Result.success(roleService.pageRoles(current, size, keyword));
    }

    @Override
    public Result<Void> save(@Valid @RequestBody RoleSaveDTO dto) {
        roleService.saveRole(dto);
        return Result.success("操作成功", null);
    }

    @Override
    public Result<Void> delete(@PathVariable Long id) {
        roleService.deleteRole(id);
        return Result.success("删除成功", null);
    }

    @Override
    public Result<java.util.List<SysRole>> all() {
        return Result.success(roleService.listAllRoles());
    }

    @Override
    public Result<java.util.List<Long>> menuIds(@PathVariable Long id) {
        return Result.success(roleService.listRoleMenuIds(id));
    }
}
