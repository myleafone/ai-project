package com.example.api.v1;

import com.example.common.result.Result;
import com.example.dto.LoginDTO;
import com.example.vo.LoginVO;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping("/api/auth")
public interface AuthApi {

    @PostMapping("/login")
    Result<LoginVO> login(@Valid @RequestBody LoginDTO dto);
}
