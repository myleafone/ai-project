package com.example.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ConfigSaveDTO {
    private String id;

    @NotBlank(message = "范围ID不能为空")
    private String scopeId;

    private String storeName;
    private String configName;
    private String tags;

    @NotBlank(message = "options不能为空")
    private String options;

    private Integer status;
}
