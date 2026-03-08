package com.example.vo;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ConfigVO {
    private String id;
    private String scopeId;
    private String storeName;
    private String configName;
    private String tags;
    private String options;
    private Integer status;
    private LocalDateTime updateTime;
}
