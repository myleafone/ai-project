package com.example.service.impl;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.common.exception.BusinessException;
import com.example.dao.SysUserDao;
import com.example.dao.SysUserRoleDao;
import com.example.dto.UserSaveDTO;
import com.example.entity.SysUser;
import com.example.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final SysUserDao userDao;
    private final SysUserRoleDao userRoleDao;

    @Override
    public Page<SysUser> pageUsers(long current, long size, String keyword) {
        return userDao.page(current, size, keyword);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void saveUser(UserSaveDTO dto) {
        if (dto.getId() == null) {
            SysUser exist = userDao.findByUsername(dto.getUsername());
            if (exist != null) {
                throw new BusinessException("用户名已存在");
            }
            SysUser user = new SysUser();
            user.setUsername(dto.getUsername());
            user.setPassword(dto.getPassword());
            user.setNickname(dto.getNickname());
            user.setPhone(dto.getPhone());
            user.setStatus(dto.getStatus());
            userDao.save(user);
            userRoleDao.resetRoles(user.getId(), dto.getRoleIds());
            return;
        }

        SysUser user = userDao.findById(dto.getId());
        if (user == null) {
            throw new BusinessException("用户不存在");
        }
        user.setUsername(dto.getUsername());
        user.setPassword(dto.getPassword());
        user.setNickname(dto.getNickname());
        user.setPhone(dto.getPhone());
        user.setStatus(dto.getStatus());
        userDao.save(user);
        userRoleDao.resetRoles(dto.getId(), dto.getRoleIds());
    }

    @Override
    public void deleteUser(Long id) {
        userDao.deleteById(id);
        userRoleDao.deleteByUserId(id);
    }

    @Override
    public List<Long> listUserRoleIds(Long userId) {
        return userRoleDao.listRoleIdsByUserId(userId);
    }
}
