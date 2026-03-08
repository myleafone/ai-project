package com.example.dao;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.entity.SysConfig;
import com.example.mapper.SysConfigMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

@Repository
@RequiredArgsConstructor
public class SysConfigDao {

    private final SysConfigMapper configMapper;

    public SysConfig findById(Long id) {
        return configMapper.selectById(id);
    }

    public Page<SysConfig> page(long current, long size, String keyword) {
        LambdaQueryWrapper<SysConfig> wrapper = new LambdaQueryWrapper<>();
        if (StringUtils.hasText(keyword)) {
            wrapper.and(w -> w.like(SysConfig::getScopeId, keyword)
                    .or().like(SysConfig::getConfigName, keyword)
                    .or().like(SysConfig::getTags, keyword));
        }
        wrapper.orderByDesc(SysConfig::getId);
        return configMapper.selectPage(new Page<>(current, size), wrapper);
    }

    public void save(SysConfig config) {
        if (config.getId() == null) {
            configMapper.insert(config);
        } else {
            configMapper.updateById(config);
        }
    }

    public void deleteById(Long id) {
        configMapper.deleteById(id);
    }
}
