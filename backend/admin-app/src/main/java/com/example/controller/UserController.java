package com.example.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.api.v1.UserApi;
import com.example.common.result.Result;
import com.example.dto.UserSaveDTO;
import com.example.entity.SysUser;
import com.example.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class UserController implements UserApi {

    private final UserService userService;

    @Override
    public Result<Page<SysUser>> page(@RequestParam(defaultValue = "1") long current,
                                      @RequestParam(defaultValue = "10") long size,
                                      @RequestParam(required = false) String keyword) {
        return Result.success(userService.pageUsers(current, size, keyword));
    }

    @Override
    public Result<Void> save(@Valid @RequestBody UserSaveDTO dto) {
        userService.saveUser(dto);
        return Result.success("操作成功", null);
    }

    @Override
    public Result<Void> delete(@PathVariable Long id) {
        userService.deleteUser(id);
        return Result.success("删除成功", null);
    }

    @Override
    public Result<java.util.List<Long>> roleIds(@PathVariable Long id) {
        return Result.success(userService.listUserRoleIds(id));
    }
}
