package com.example.interceptor;

import com.example.common.exception.BusinessException;
import com.example.common.utils.JwtUtils;
import com.example.security.AuthContext;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
@RequiredArgsConstructor
public class JwtAuthInterceptor implements HandlerInterceptor {

    private final JwtUtils jwtUtils;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new BusinessException(401, "未登录或Token缺失");
        }
        String token = authHeader.substring(7);
        try {
            Claims claims = jwtUtils.parseToken(token);
            AuthContext.setUserId(Long.parseLong(claims.getSubject()));
            return true;
        } catch (ExpiredJwtException e) {
            throw new BusinessException(401, "Token已过期");
        } catch (Exception e) {
            throw new BusinessException(401, "Token无效");
        }
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        AuthContext.clear();
    }
}
