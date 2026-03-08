package com.example.api.v1;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.common.result.Result;
import com.example.dto.UserSaveDTO;
import com.example.entity.SysUser;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/api/users")
public interface UserApi {

    @GetMapping
    Result<Page<SysUser>> page(@RequestParam(defaultValue = "1") long current,
                               @RequestParam(defaultValue = "10") long size,
                               @RequestParam(required = false) String keyword);

    @PostMapping
    Result<Void> save(@Valid @RequestBody UserSaveDTO dto);

    @DeleteMapping("/{id}")
    Result<Void> delete(@PathVariable Long id);

    @GetMapping("/{id}/role-ids")
    Result<java.util.List<Long>> roleIds(@PathVariable Long id);
}
