package com.example.vo;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class MenuVO {
    private Long id;
    private Long parentId;
    private String menuName;
    private String path;
    private String component;
    private String icon;
    private Integer sort;
    private Integer menuType;
    private String perms;
    private List<MenuVO> children = new ArrayList<>();
}
