package com.example.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.dto.UserSaveDTO;
import com.example.entity.SysUser;

public interface UserService {
    Page<SysUser> pageUsers(long current, long size, String keyword);

    void saveUser(UserSaveDTO dto);

    void deleteUser(Long id);

    java.util.List<Long> listUserRoleIds(Long userId);
}
