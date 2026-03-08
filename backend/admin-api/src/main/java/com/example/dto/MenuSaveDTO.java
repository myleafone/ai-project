package com.example.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MenuSaveDTO {
    private Long id;

    @NotNull(message = "父级ID不能为空")
    private Long parentId;

    @NotBlank(message = "菜单名称不能为空")
    private String menuName;

    private String path;
    private String component;
    private String icon;
    private Integer sort;

    @NotNull(message = "菜单类型不能为空")
    private Integer menuType;

    private String perms;
}
