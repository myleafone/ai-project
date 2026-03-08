package com.example.service.impl;

import com.example.dao.SysUserDao;
import com.example.common.exception.BusinessException;
import com.example.common.utils.JwtUtils;
import com.example.dto.LoginDTO;
import com.example.entity.SysUser;
import com.example.service.AuthService;
import com.example.vo.LoginVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final SysUserDao userDao;
    private final JwtUtils jwtUtils;

    @Override
    public LoginVO login(LoginDTO dto) {
        SysUser user = userDao.findByUsername(dto.getUsername());
        if (user == null || !user.getPassword().equals(dto.getPassword())) {
            throw new BusinessException(401, "用户名或密码错误");
        }
        if (user.getStatus() != 1) {
            throw new BusinessException(403, "用户已禁用");
        }
        String token = jwtUtils.generateToken(user.getId(), user.getUsername());
        return new LoginVO(token, user.getId(), user.getUsername());
    }
}
