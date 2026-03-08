package com.example.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.dto.ConfigSaveDTO;
import com.example.vo.ConfigVO;

public interface ConfigService {

    Page<ConfigVO> pageConfigs(long current, long size, String keyword);

    void saveConfig(ConfigSaveDTO dto);

    void deleteConfig(String id);
}
