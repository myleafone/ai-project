package com.example.api.v1;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.common.result.Result;
import com.example.dto.RoleSaveDTO;
import com.example.entity.SysRole;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/api/roles")
public interface RoleApi {

    @GetMapping
    Result<Page<SysRole>> page(@RequestParam(defaultValue = "1") long current,
                               @RequestParam(defaultValue = "10") long size,
                               @RequestParam(required = false) String keyword);

    @PostMapping
    Result<Void> save(@Valid @RequestBody RoleSaveDTO dto);

    @DeleteMapping("/{id}")
    Result<Void> delete(@PathVariable Long id);

    @GetMapping("/all")
    Result<java.util.List<SysRole>> all();

    @GetMapping("/{id}/menu-ids")
    Result<java.util.List<Long>> menuIds(@PathVariable Long id);
}
