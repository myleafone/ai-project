<template>
  <el-card>
    <div class="toolbar">
      <el-input v-model="query.keyword" placeholder="范围ID/配置名称/标签" style="width: 300px" clearable />
      <el-button type="primary" @click="loadData">查询</el-button>
      <el-button type="success" @click="openDialog()">新增配置</el-button>
    </div>

    <el-table :data="tableData" style="margin-top: 12px" border>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="scopeId" label="范围ID" width="140" />
      <el-table-column prop="configName" label="配置名称" width="180" />
      <el-table-column prop="tags" label="标记" show-overflow-tooltip />
      <el-table-column label="options(JSON)" min-width="420">
        <template #default="scope">
          <div class="config-cell">
            <template v-if="getRenderedLines(scope.row).length">
              <div v-for="line in getRenderedLines(scope.row)" :key="line.key" class="kv" :style="{ marginLeft: `${line.depth * 14}px` }">
                <span class="k">{{ line.name }}</span>
                <span class="v">{{ line.value }}</span>
              </div>
            </template>
            <span v-else class="muted">空</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.status === 1 ? 'success' : scope.row.status === 0 ? 'danger' : 'info'">
            {{ scope.row.status === 1 ? '启用' : scope.row.status === 0 ? '禁用' : '未知' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="修改时间" width="180" />
      <el-table-column label="操作" width="160">
        <template #default="scope">
          <el-button link type="primary" @click="openDialog(scope.row)">编辑</el-button>
          <el-button link type="danger" @click="onDelete(scope.row.id!)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      style="margin-top: 12px; justify-content: flex-end"
      background
      layout="total, prev, pager, next"
      :total="total"
      :page-size="query.size"
      :current-page="query.current"
      @current-change="onPageChange"
    />

    <el-dialog v-model="visible" :title="form.id ? '编辑配置' : '新增配置'" width="980px" top="4vh">
      <el-form :model="form" label-width="88px">
        <div class="form-grid">
          <el-form-item label="范围ID"><el-input v-model="form.scopeId" /></el-form-item>
          <el-form-item label="配置名称"><el-input v-model="form.configName" /></el-form-item>
          <el-form-item label="标签" class="full"><el-input v-model="form.tags" /></el-form-item>
          <el-form-item label="状态">
            <el-radio-group v-model="form.status">
              <el-radio :value="1">启用</el-radio>
              <el-radio :value="0">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
      </el-form>

      <div class="editor-box">
        <div class="editor-head">
          <span>options 动态 JSON 编辑</span>
          <div class="editor-actions">
            <el-button size="small" @click="expandAll">全部展开</el-button>
            <el-button size="small" @click="collapseAll">全部折叠</el-button>
            <el-button type="primary" size="small" @click="addRootChild">+ 根节点新增字段/元素</el-button>
          </div>
        </div>

        <div class="rows">
          <div class="columns-head">
            <span class="col-key">字段 / 节点</span>
            <span class="col-type">类型</span>
            <span class="col-value">值 / 概览</span>
            <span class="col-ops">操作</span>
          </div>
          <div
            v-for="node in flatNodes"
            :key="node.pathCode"
            class="tree-row"
            :class="[`depth-${Math.min(node.depth, 4)}`]"
            :style="{ marginLeft: `${node.depth * 16}px` }"
          >
            <div class="key-col">
              <el-icon
                v-if="node.type === 'object' || node.type === 'array'"
                class="fold-icon"
                @click="onToggleExpand(node.pathCode)"
              >
                <CaretBottom v-if="isExpanded(node.pathCode)" />
                <CaretRight v-else />
              </el-icon>
              <span v-if="node.path.length === 0" class="node-name root">ROOT</span>
              <span v-else-if="node.inArray" class="node-index">[{{ node.lastSegment }}]</span>
              <el-input
                v-else
                :model-value="String(node.keyLabel)"
                placeholder="字段名"
                @change="onRenameKey(node.pathCode, String($event ?? ''))"
              />
              <span v-if="node.path.length" class="path-hint">{{ pathLabel(node) }}</span>
            </div>

            <el-select :model-value="node.type" @change="onChangeType(node.pathCode, String($event))">
              <el-option label="字符串" value="string" />
              <el-option label="数字" value="number" />
              <el-option label="布尔" value="boolean" />
              <el-option label="空值(null)" value="null" />
              <el-option label="数组" value="array" />
              <el-option label="对象" value="object" />
            </el-select>

            <div class="value-col">
              <el-select
                v-if="node.type === 'boolean'"
                :model-value="String(node.value)"
                @change="onChangeBoolean(node.pathCode, String($event))"
              >
                <el-option label="true" value="true" />
                <el-option label="false" value="false" />
              </el-select>
              <span v-else-if="node.type === 'null'" class="node-count">null</span>
              <span v-else-if="node.type === 'object'" class="node-count">对象 {{ Object.keys(node.value as Record<string, unknown>).length }} 项</span>
              <span v-else-if="node.type === 'array'" class="node-count">数组 {{ (node.value as unknown[]).length }} 项</span>
              <el-input
                v-else
                :type="node.type === 'number' ? 'number' : 'text'"
                :model-value="String(node.value ?? '')"
                @input="onChangeScalar(node.pathCode, String($event ?? ''))"
              />
            </div>

            <div class="ops-col">
              <el-button v-if="node.type === 'object' || node.type === 'array'" size="small" @click="onAddChild(node.pathCode)">+ 子项</el-button>
              <el-button v-if="node.path.length > 0" size="small" type="danger" @click="onRemoveNode(node.pathCode)">删除</el-button>
            </div>
          </div>
          <div v-if="!flatNodes.length" class="empty">无可编辑节点</div>
        </div>

        <div class="preview-title">实时 JSON 预览</div>
        <el-input type="textarea" :rows="10" :model-value="jsonPreview" readonly />
        <div class="error-text">{{ errorText }}</div>
      </div>

      <template #footer>
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { CaretBottom, CaretRight } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { deleteConfigApi, pageConfigApi, saveConfigApi } from './api';
import type { ConfigItem } from './types';

type JsonValue = any;
type JsonType = 'string' | 'number' | 'boolean' | 'null' | 'array' | 'object';
type PathSegment = string | number;

interface FlatNode {
  path: PathSegment[];
  pathCode: string;
  depth: number;
  keyLabel: string | number;
  inArray: boolean;
  lastSegment: string | number;
  type: JsonType;
  value: JsonValue;
}

const query = reactive({ current: 1, size: 10, keyword: '' });
const total = ref(0);
const tableData = ref<ConfigItem[]>([]);
const lineCache = ref<Record<string, Array<{ key: string; name: string; value: string; depth: number }>>>({});
const visible = ref(false);
const errorText = ref('');
const editingOptions = ref<JsonValue>({});
const expandedMap = ref<Record<string, boolean>>({});

const form = reactive<ConfigItem>({
  scopeId: '',
  configName: '',
  tags: '',
  options: '{}',
  status: 1
});

function isNodeVisible(node: FlatNode): boolean {
  // 根节点始终可见
  if (!node.path.length) return true;

  // 如果根节点被折叠，则所有子节点都隐藏
  if (expandedMap.value[''] === false) return false;

  // 其余情况：节点本身始终可见，只根据“祖先节点”是否折叠决定
  const segments = node.path;
  const walked: PathSegment[] = [];
  for (let i = 0; i < segments.length - 1; i += 1) {
    walked.push(segments[i]);
    const code = encodePath(walked);
    if (expandedMap.value[code] === false) return false;
  }
  return true;
}

const flatNodes = computed(() => {
  const all = flatten(editingOptions.value);
  if (!Object.keys(expandedMap.value).length) {
    all.forEach((node) => {
      if (node.type === 'object' || node.type === 'array' || node.path.length === 0) {
        expandedMap.value[node.pathCode] = true;
      }
    });
  }
  return all.filter((node) => isNodeVisible(node));
});
const jsonPreview = computed(() => JSON.stringify(editingOptions.value, null, 2));

function pathLabel(node: FlatNode): string {
  if (!node.path.length) return 'ROOT';
  return node.path
    .map((seg) => (typeof seg === 'number' ? `[${seg}]` : String(seg)))
    .join('.');
}

function expandAll() {
  const all = flatten(editingOptions.value);
  const next: Record<string, boolean> = {};
  all.forEach((node) => {
    if (node.path.length === 0 || node.type === 'object' || node.type === 'array') {
      next[node.pathCode] = true;
    }
  });
  expandedMap.value = next;
}

function collapseAll() {
  expandedMap.value = { '': false };
}

async function loadData() {
  const data = await pageConfigApi(query);
  tableData.value = data.records;
  total.value = data.total;
  lineCache.value = {};
}

function onPageChange(page: number) {
  query.current = page;
  loadData();
}

function parseOptions(options: string): JsonValue {
  try {
    const parsed = JSON.parse(options);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function openDialog(row?: ConfigItem) {
  errorText.value = '';
  expandedMap.value = {};
  if (row) {
    Object.assign(form, row);
    editingOptions.value = parseOptions(row.options);
  } else {
    Object.assign(form, { id: undefined, scopeId: '', configName: '', tags: '', options: '{}', status: 1 });
    editingOptions.value = {};
  }
  visible.value = true;
}

async function onSubmit() {
  try {
    form.options = JSON.stringify(editingOptions.value);
    JSON.parse(form.options);
    await saveConfigApi(form);
    visible.value = false;
    await loadData();
    ElMessage.success('保存成功');
  } catch (err: any) {
    errorText.value = err?.message || '保存失败';
  }
}

async function onDelete(id: string) {
  await ElMessageBox.confirm('确认删除该配置？', '提示', { type: 'warning' });
  await deleteConfigApi(id);
  await loadData();
}

function renderLines(options: string): Array<{ key: string; name: string; value: string; depth: number }> {
  const value = parseOptions(options);
  const lines: Array<{ key: string; name: string; value: string; depth: number }> = [];

  const walk = (node: JsonValue, depth: number, label: string) => {
    const t = nodeType(node);
    if (label) {
      lines.push({ key: `${depth}-${label}-${lines.length}`, name: label, value: formatValue(node), depth });
    }
    if (t === 'object') {
      Object.entries(node as Record<string, JsonValue>).forEach(([k, v]) => walk(v, depth + 1, k));
    }
    if (t === 'array') {
      (node as JsonValue[]).forEach((v, idx) => walk(v, depth + 1, `[${idx}]`));
    }
  };

  if (nodeType(value) === 'object') {
    Object.entries(value as Record<string, JsonValue>).forEach(([k, v]) => walk(v, 0, k));
  } else if (nodeType(value) === 'array') {
    (value as JsonValue[]).forEach((v, idx) => walk(v, 0, `[${idx}]`));
  }
  return lines;
}

function getRenderedLines(row: ConfigItem): Array<{ key: string; name: string; value: string; depth: number }> {
  const cacheKey = `${row.id || 'new'}:${row.updateTime || ''}:${row.options?.length || 0}`;
  const existed = lineCache.value[cacheKey];
  if (existed) {
    return existed;
  }
  const lines = renderLines(row.options);
  lineCache.value[cacheKey] = lines;
  return lines;
}

function nodeType(v: JsonValue): JsonType {
  if (Array.isArray(v)) return 'array';
  if (v === null) return 'null';
  if (typeof v === 'number') return 'number';
  if (typeof v === 'boolean') return 'boolean';
  if (typeof v === 'object') return 'object';
  return 'string';
}

function typeDefaultValue(type: JsonType): JsonValue {
  if (type === 'object') return {};
  if (type === 'array') return [];
  if (type === 'number') return 0;
  if (type === 'boolean') return false;
  if (type === 'null') return null;
  return '';
}

function formatValue(v: JsonValue): string {
  const t = nodeType(v);
  if (t === 'array') return `[${(v as JsonValue[]).length}]`;
  if (t === 'object') return `{${Object.keys(v as Record<string, JsonValue>).length}}`;
  if (t === 'null') return 'null';
  return String(v);
}

function encodePath(path: PathSegment[]): string {
  return path.map((seg) => (typeof seg === 'number' ? `n:${seg}` : `s:${encodeURIComponent(seg)}`)).join('|');
}

function decodePath(encoded: string): PathSegment[] {
  if (!encoded) return [];
  return encoded.split('|').map((p) => (p.startsWith('n:') ? Number(p.slice(2)) : decodeURIComponent(p.slice(2))));
}

function isContainer(v: JsonValue): v is JsonValue[] | Record<string, JsonValue> {
  return typeof v === 'object' && v !== null;
}

function getNode(path: PathSegment[]): JsonValue {
  let cur: JsonValue = editingOptions.value;
  for (const seg of path) {
    if (!isContainer(cur)) return '';
    cur = (cur as any)[seg];
  }
  return cur;
}

function getParentAndKey(path: PathSegment[]) {
  if (!path.length) return { parent: null, key: null as PathSegment | null };
  return { parent: getNode(path.slice(0, -1)), key: path[path.length - 1] };
}

function setNode(path: PathSegment[], value: JsonValue) {
  if (!path.length) {
    editingOptions.value = value;
    return;
  }
  const { parent, key } = getParentAndKey(path);
  if (Array.isArray(parent)) {
    parent[key as number] = value;
    return;
  }
  if (parent && typeof parent === 'object') {
    (parent as Record<string, JsonValue>)[String(key)] = value;
  }
}

function removeNode(path: PathSegment[]) {
  if (!path.length) return;
  const { parent, key } = getParentAndKey(path);
  if (Array.isArray(parent)) {
    parent.splice(key as number, 1);
    return;
  }
  if (parent && typeof parent === 'object') {
    delete (parent as Record<string, JsonValue>)[String(key)];
  }
}

function addChild(path: PathSegment[]) {
  const target = getNode(path);
  if (Array.isArray(target)) {
    target.push('');
    return;
  }
  if (target && typeof target === 'object') {
    const obj = target as Record<string, JsonValue>;
    let base = 'newKey';
    let name = base;
    let i = 1;
    while (Object.prototype.hasOwnProperty.call(obj, name)) {
      name = `${base}${i}`;
      i += 1;
    }
    obj[name] = '';
  }
}

function renameObjectKey(path: PathSegment[], nextKey: string) {
  const trimmed = (nextKey || '').trim();
  if (!trimmed) throw new Error('字段名不能为空');
  const { parent, key } = getParentAndKey(path);
  if (!parent || Array.isArray(parent)) return;
  const oldKey = String(key);
  if (trimmed === oldKey) return;
  if (Object.prototype.hasOwnProperty.call(parent, trimmed)) {
    throw new Error(`字段名重复: ${trimmed}`);
  }
  (parent as Record<string, JsonValue>)[trimmed] = (parent as Record<string, JsonValue>)[oldKey];
  delete (parent as Record<string, JsonValue>)[oldKey];
}

function flatten(root: JsonValue): FlatNode[] {
  const nodes: FlatNode[] = [];
  const walk = (node: JsonValue, path: PathSegment[], depth: number, keyLabel: string | number, inArray: boolean) => {
    const type = nodeType(node);
    nodes.push({
      path,
      pathCode: encodePath(path),
      depth,
      keyLabel,
      inArray,
      lastSegment: path[path.length - 1] ?? 'ROOT',
      type,
      value: node
    });
    if (type === 'object') {
      Object.entries(node as Record<string, JsonValue>).forEach(([k, v]) => walk(v, path.concat(k), depth + 1, k, false));
    }
    if (type === 'array') {
      (node as JsonValue[]).forEach((v, idx) => walk(v, path.concat(idx), depth + 1, idx, true));
    }
  };
  walk(root, [], 0, 'ROOT', false);
  return nodes;
}

function onChangeType(pathCode: string, nextType: string) {
  try {
    setNode(decodePath(pathCode), typeDefaultValue(nextType as JsonType));
    errorText.value = '';
  } catch (err: any) {
    errorText.value = err?.message || '更新失败';
  }
}

function onChangeScalar(pathCode: string, raw: string) {
  try {
    const path = decodePath(pathCode);
    const t = nodeType(getNode(path));
    if (t === 'string') {
      setNode(path, raw);
    }
    if (t === 'number') {
      if (raw === '') throw new Error('数字类型不能为空');
      const n = Number(raw);
      if (Number.isNaN(n)) throw new Error('数字类型必须输入合法数字');
      setNode(path, n);
    }
    errorText.value = '';
  } catch (err: any) {
    errorText.value = err?.message || '更新失败';
  }
}

function onChangeBoolean(pathCode: string, raw: string) {
  setNode(decodePath(pathCode), raw === 'true');
  errorText.value = '';
}

function onRenameKey(pathCode: string, nextKey: string) {
  try {
    renameObjectKey(decodePath(pathCode), nextKey);
    errorText.value = '';
  } catch (err: any) {
    errorText.value = err?.message || '更新失败';
  }
}

function onAddChild(pathCode: string) {
  addChild(decodePath(pathCode));
  errorText.value = '';
}

function onRemoveNode(pathCode: string) {
  removeNode(decodePath(pathCode));
  errorText.value = '';
}

function isExpanded(pathCode: string): boolean {
  return expandedMap.value[pathCode] !== false;
}

function onToggleExpand(pathCode: string) {
  expandedMap.value[pathCode] = !isExpanded(pathCode);
}

function addRootChild() {
  const rootType = nodeType(editingOptions.value);
  if (rootType === 'object' || rootType === 'array') {
    addChild([]);
  } else {
    editingOptions.value = { newKey: '' };
  }
}

(async () => {
  await loadData();
})();
</script>

<style scoped>
.toolbar { display: flex; gap: 8px; }
.form-grid {
  display: grid;
  gap: 8px 12px;
  grid-template-columns: 1fr 1fr;
}
.form-grid .full { grid-column: 1 / -1; }
.config-cell {
  display: grid;
  gap: 6px;
  max-height: 190px;
  overflow: auto;
  padding-right: 4px;
}
.kv {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  line-height: 1.35;
}
.k { min-width: 110px; color: #4a5b7a; font-weight: 600; word-break: break-word; }
.v { color: #23304a; word-break: break-word; white-space: pre-wrap; }
.muted { color: #909399; }
.editor-box {
  border: 1px solid #e5e9f2;
  border-radius: 8px;
  padding: 10px;
  background: #fbfcff;
}
.editor-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
.editor-actions {
  display: flex;
  gap: 6px;
}
.rows {
  max-height: 380px;
  overflow: auto;
  display: grid;
  gap: 8px;
}
.columns-head {
  position: sticky;
  top: 0;
  z-index: 2;
  display: grid;
  grid-template-columns: 1.3fr 130px 1fr auto;
  padding: 6px 8px;
  background: #f5f7fb;
  border-bottom: 1px solid #e0e4f0;
  font-size: 12px;
  color: #7a889f;
}
.columns-head span {
  display: flex;
  align-items: center;
}
.tree-row {
  display: grid;
  grid-template-columns: 1.3fr 130px 1fr auto;
  gap: 8px;
  align-items: center;
  padding: 8px;
  border: 1px solid #edf1f8;
  border-radius: 8px;
  background: #fff;
  position: relative;
}
.key-col, .value-col {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}
.path-hint {
  font-size: 11px;
  color: #b0b7c6;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.fold-icon {
  cursor: pointer;
  color: #9ca8bf;
}
.fold-icon:hover {
  color: #596480;
}
.ops-col { display: flex; gap: 6px; justify-content: flex-end; }
.node-name.root { font-weight: 700; color: #2a3b55; }
.node-index { color: #7a889f; font-size: 12px; min-width: 30px; }
.node-count {
  color: #4d5f80;
  font-size: 12px;
  background: #f2f6ff;
  border-radius: 999px;
  padding: 2px 8px;
  line-height: 1.6;
}
.tree-row.depth-1 {
  background: #ffffff;
}
.tree-row.depth-2 {
  background: #fbfcff;
}
.tree-row.depth-3 {
  background: #f7f9ff;
}
.tree-row.depth-4 {
  background: #f4f6fd;
}
.preview-title {
  margin-top: 12px;
  margin-bottom: 8px;
  color: #4f6284;
  font-size: 12px;
}
.error-text {
  min-height: 18px;
  margin-top: 8px;
  color: #d43f3a;
  font-size: 12px;
}
.empty {
  text-align: center;
  color: #909399;
  padding: 16px 10px;
}
@media (max-width: 900px) {
  .tree-row { grid-template-columns: 1fr; }
  .ops-col { justify-content: flex-start; }
}
</style>
