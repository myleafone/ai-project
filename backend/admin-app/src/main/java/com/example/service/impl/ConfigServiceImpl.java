package com.example.service.impl;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.common.exception.BusinessException;
import com.example.dto.ConfigSaveDTO;
import com.example.service.ConfigService;
import com.example.vo.ConfigVO;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ConfigServiceImpl implements ConfigService {

    private static final String TABLE_NAME = "sys_config";

    private final JdbcTemplate jdbcTemplate;
    private final ObjectMapper objectMapper;

    @Override
    public Page<ConfigVO> pageConfigs(long current, long size, String keyword) {
        Set<String> columns = loadColumns();
        PkMeta pkMeta = loadPrimaryKey(columns);
        if (pkMeta == null) {
            throw new BusinessException("sys_config表缺少主键字段");
        }
        String pkCol = pkMeta.column();

        StringBuilder where = new StringBuilder(" WHERE 1=1 ");
        List<Object> params = new ArrayList<>();

        if (columns.contains("deleted")) {
            where.append(" AND deleted = 0 ");
        }

        if (StringUtils.hasText(keyword)) {
            List<String> kwCols = pickExisting(columns, pkCol, "scope_id", "store_name", "config_name", "name", "tags");
            if (!kwCols.isEmpty()) {
                where.append(" AND (");
                for (int i = 0; i < kwCols.size(); i++) {
                    if (i > 0) {
                        where.append(" OR ");
                    }
                    where.append(kwCols.get(i)).append(" LIKE ? ");
                    params.add("%" + keyword.trim() + "%");
                }
                where.append(") ");
            }
        }

        Long total = jdbcTemplate.queryForObject(
                "SELECT COUNT(1) FROM " + TABLE_NAME + where,
                params.toArray(),
                Long.class
        );

        long safeCurrent = Math.max(current, 1);
        long safeSize = Math.max(size, 1);
        long offset = (safeCurrent - 1) * safeSize;

        List<Object> dataParams = new ArrayList<>(params);
        dataParams.add(offset);
        dataParams.add(safeSize);

        List<Map<String, Object>> rows = jdbcTemplate.queryForList(
                "SELECT * FROM " + TABLE_NAME + where + " ORDER BY " + pkCol + " DESC LIMIT ?, ?",
                dataParams.toArray()
        );

        List<ConfigVO> records = rows.stream().map(row -> toConfigVO(row, pkCol)).toList();
        Page<ConfigVO> page = new Page<>(safeCurrent, safeSize, total == null ? 0 : total);
        page.setRecords(records);
        return page;
    }

    @Override
    public void saveConfig(ConfigSaveDTO dto) {
        Set<String> columns = loadColumns();
        PkMeta pkMeta = loadPrimaryKey(columns);
        if (pkMeta == null) {
            throw new BusinessException("sys_config表缺少主键字段");
        }
        String pkCol = pkMeta.column();

        String scopeCol = firstExisting(columns, "scope_id", "scope");
        String nameCol = firstExisting(columns, "store_name", "config_name", "name");
        String optionsCol = firstExisting(columns, "options", "config");
        String tagsCol = firstExisting(columns, "tags");
        String statusCol = firstExisting(columns, "status");

        if (optionsCol == null) {
            throw new BusinessException("sys_config表缺少JSON字段(options/config)");
        }

        JsonNode optionsNode = parseAndValidateOptions(dto.getOptions());

        Map<String, Object> data = new LinkedHashMap<>();
        if (scopeCol != null && dto.getScopeId() != null) {
            data.put(scopeCol, dto.getScopeId().trim());
        }
        String name = StringUtils.hasText(dto.getStoreName()) ? dto.getStoreName() : dto.getConfigName();
        if (nameCol != null && name != null) {
            data.put(nameCol, name.trim());
        }
        if (tagsCol != null) {
            data.put(tagsCol, dto.getTags());
        }
        data.put(optionsCol, optionsNode.toString());
        if (statusCol != null && dto.getStatus() != null) {
            data.put(statusCol, dto.getStatus());
        }

        if (!StringUtils.hasText(dto.getId())) {
            insert(data, columns, pkMeta);
        } else {
            Long exist = jdbcTemplate.queryForObject("SELECT COUNT(1) FROM " + TABLE_NAME + " WHERE " + pkCol + " = ?", Long.class, dto.getId());
            if (exist != null && exist > 0) {
                update(pkCol, dto.getId(), data);
                return;
            }
            data.put(pkCol, dto.getId());
            insert(data, columns, pkMeta);
        }
    }

    @Override
    public void deleteConfig(String id) {
        Set<String> columns = loadColumns();
        PkMeta pkMeta = loadPrimaryKey(columns);
        if (pkMeta == null) {
            throw new BusinessException("sys_config表缺少主键字段");
        }
        String pkCol = pkMeta.column();
        if (columns.contains("deleted")) {
            jdbcTemplate.update("UPDATE " + TABLE_NAME + " SET deleted = 1 WHERE " + pkCol + " = ?", id);
            return;
        }
        jdbcTemplate.update("DELETE FROM " + TABLE_NAME + " WHERE " + pkCol + " = ?", id);
    }

    private void insert(Map<String, Object> data, Set<String> columns, PkMeta pkMeta) {
        if (columns.contains("deleted") && !data.containsKey("deleted")) {
            data.put("deleted", 0);
        }
        if (!pkMeta.autoIncrement() && !data.containsKey(pkMeta.column())) {
            throw new BusinessException("新增配置需要提供主键ID");
        }
        if (data.isEmpty()) {
            throw new BusinessException("无可写入字段");
        }

        List<String> fields = new ArrayList<>(data.keySet());
        String fieldSql = String.join(",", fields);
        String placeholderSql = fields.stream().map(x -> "?").collect(Collectors.joining(","));
        Object[] values = fields.stream().map(data::get).toArray();

        jdbcTemplate.update("INSERT INTO " + TABLE_NAME + " (" + fieldSql + ") VALUES (" + placeholderSql + ")", values);
    }

    private void update(String pkCol, String id, Map<String, Object> data) {
        Long exist = jdbcTemplate.queryForObject("SELECT COUNT(1) FROM " + TABLE_NAME + " WHERE " + pkCol + " = ?", Long.class, id);
        if (exist == null || exist == 0) {
            throw new BusinessException("配置不存在");
        }
        if (data.isEmpty()) {
            throw new BusinessException("无可更新字段");
        }

        String setSql = data.keySet().stream().map(k -> k + " = ?").collect(Collectors.joining(","));
        List<Object> values = new ArrayList<>(data.values());
        values.add(id);

        jdbcTemplate.update("UPDATE " + TABLE_NAME + " SET " + setSql + " WHERE " + pkCol + " = ?", values.toArray());
    }

    private ConfigVO toConfigVO(Map<String, Object> row, String pkCol) {
        ConfigVO vo = new ConfigVO();
        vo.setId(toString(pickValue(row, pkCol, "id")));
        vo.setScopeId(toString(pickValue(row, "scope_id", "scope")));

        String name = toString(pickValue(row, "store_name", "config_name", "name"));
        vo.setStoreName(name);
        vo.setConfigName(name);

        vo.setTags(toString(pickValue(row, "tags")));
        vo.setOptions(toString(pickValue(row, "options", "config")));
        vo.setStatus(toInt(pickValue(row, "status")));
        vo.setUpdateTime(toTime(pickValue(row, "update_time", "modify_time", "gmt_modified")));
        return vo;
    }

    private JsonNode parseAndValidateOptions(String options) {
        try {
            JsonNode node = objectMapper.readTree(options);
            if (!node.isObject() && !node.isArray()) {
                throw new BusinessException("options根节点必须是对象或数组");
            }
            return node;
        } catch (BusinessException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new BusinessException("options必须是合法JSON");
        }
    }

    private Set<String> loadColumns() {
        List<String> cols = jdbcTemplate.queryForList(
                "SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? ORDER BY ORDINAL_POSITION",
                String.class,
                TABLE_NAME
        );
        if (cols == null || cols.isEmpty()) {
            return Collections.emptySet();
        }
        return cols.stream().map(x -> x.toLowerCase(Locale.ROOT)).collect(Collectors.toCollection(HashSet::new));
    }

    private PkMeta loadPrimaryKey(Set<String> columns) {
        List<Map<String, Object>> pkCols = jdbcTemplate.queryForList(
                "SELECT c.COLUMN_NAME AS column_name, c.EXTRA AS extra FROM information_schema.KEY_COLUMN_USAGE k " +
                        "JOIN information_schema.COLUMNS c ON c.TABLE_SCHEMA = k.TABLE_SCHEMA AND c.TABLE_NAME = k.TABLE_NAME AND c.COLUMN_NAME = k.COLUMN_NAME " +
                        "WHERE k.TABLE_SCHEMA = DATABASE() AND k.TABLE_NAME = ? AND k.CONSTRAINT_NAME = 'PRIMARY' " +
                        "ORDER BY k.ORDINAL_POSITION",
                TABLE_NAME
        );
        if (pkCols != null && !pkCols.isEmpty()) {
            Map<String, Object> first = pkCols.get(0);
            String col = toString(first.get("column_name"));
            String extra = toString(first.get("extra"));
            return new PkMeta(col == null ? null : col.toLowerCase(Locale.ROOT), extra != null && extra.toLowerCase(Locale.ROOT).contains("auto_increment"));
        }
        if (columns.contains("id")) {
            return new PkMeta("id", true);
        }
        return null;
    }

    private record PkMeta(String column, boolean autoIncrement) {
    }

    private List<String> pickExisting(Set<String> cols, String... candidates) {
        List<String> result = new ArrayList<>();
        for (String c : candidates) {
            if (cols.contains(c)) {
                result.add(c);
            }
        }
        return result;
    }

    private String firstExisting(Set<String> cols, String... candidates) {
        for (String c : candidates) {
            if (cols.contains(c)) {
                return c;
            }
        }
        return null;
    }

    private Object pickValue(Map<String, Object> row, String... keys) {
        for (String key : keys) {
            if (row.containsKey(key)) {
                return row.get(key);
            }
            String camel = toCamel(key);
            if (row.containsKey(camel)) {
                return row.get(camel);
            }
        }
        return null;
    }

    private String toCamel(String snake) {
        StringBuilder sb = new StringBuilder();
        boolean upper = false;
        for (char c : snake.toCharArray()) {
            if (c == '_') {
                upper = true;
                continue;
            }
            sb.append(upper ? Character.toUpperCase(c) : c);
            upper = false;
        }
        return sb.toString();
    }

    private String toString(Object v) {
        return v == null ? null : String.valueOf(v);
    }

    private Integer toInt(Object v) {
        if (v == null) {
            return null;
        }
        if (v instanceof Number n) {
            return n.intValue();
        }
        return Integer.parseInt(String.valueOf(v));
    }

    private LocalDateTime toTime(Object v) {
        if (v == null) {
            return null;
        }
        if (v instanceof LocalDateTime t) {
            return t;
        }
        if (v instanceof Timestamp ts) {
            return ts.toLocalDateTime();
        }
        return null;
    }
}
