package com.example.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("sys_config")
public class SysConfig extends BaseEntity {
    @TableId(type = IdType.AUTO)
    private Long id;

    private String scopeId;
    private String configName;
    private String tags;

    /**
     * JSON string persisted in db json column.
     */
    private String options;

    private Integer status;

    @TableLogic
    private Integer deleted;
}
