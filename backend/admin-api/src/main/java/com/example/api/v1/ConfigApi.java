package com.example.api.v1;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.common.result.Result;
import com.example.dto.ConfigSaveDTO;
import com.example.vo.ConfigVO;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RequestMapping("/api/configs")
public interface ConfigApi {

    @GetMapping
    Result<Page<ConfigVO>> page(@RequestParam(defaultValue = "1") long current,
                                @RequestParam(defaultValue = "10") long size,
                                @RequestParam(required = false) String keyword);

    @PostMapping
    Result<Void> save(@Valid @RequestBody ConfigSaveDTO dto);

    @DeleteMapping("/{id}")
    Result<Void> delete(@PathVariable String id);
}
