package com.example.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.api.v1.ConfigApi;
import com.example.common.result.Result;
import com.example.dto.ConfigSaveDTO;
import com.example.service.ConfigService;
import com.example.vo.ConfigVO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class ConfigController implements ConfigApi {

    private final ConfigService configService;

    @Override
    public Result<Page<ConfigVO>> page(@RequestParam(defaultValue = "1") long current,
                                       @RequestParam(defaultValue = "10") long size,
                                       @RequestParam(required = false) String keyword) {
        return Result.success(configService.pageConfigs(current, size, keyword));
    }

    @Override
    public Result<Void> save(@Valid @RequestBody ConfigSaveDTO dto) {
        configService.saveConfig(dto);
        return Result.success("操作成功", null);
    }

    @Override
    public Result<Void> delete(@PathVariable String id) {
        configService.deleteConfig(id);
        return Result.success("删除成功", null);
    }
}
