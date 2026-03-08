import { computed, reactive, ref } from 'vue';
import { CaretBottom, CaretRight } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { deleteConfigApi, pageConfigApi, saveConfigApi } from './api';
const query = reactive({ current: 1, size: 10, keyword: '' });
const total = ref(0);
const tableData = ref([]);
const lineCache = ref({});
const visible = ref(false);
const errorText = ref('');
const editingOptions = ref({});
const expandedMap = ref({});
const form = reactive({
    scopeId: '',
    configName: '',
    tags: '',
    options: '{}',
    status: 1
});
function isNodeVisible(node) {
    if (!node.path.length)
        return true;
    const segments = node.path;
    const walked = [];
    for (let i = 0; i < segments.length; i += 1) {
        walked.push(segments[i]);
        const code = encodePath(walked);
        if (expandedMap.value[code] === false)
            return false;
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
function pathLabel(node) {
    if (!node.path.length)
        return 'ROOT';
    return node.path
        .map((seg) => (typeof seg === 'number' ? `[${seg}]` : String(seg)))
        .join('.');
}
async function loadData() {
    const data = await pageConfigApi(query);
    tableData.value = data.records;
    total.value = data.total;
    lineCache.value = {};
}
function onPageChange(page) {
    query.current = page;
    loadData();
}
function parseOptions(options) {
    try {
        const parsed = JSON.parse(options);
        return parsed && typeof parsed === 'object' ? parsed : {};
    }
    catch {
        return {};
    }
}
function openDialog(row) {
    errorText.value = '';
    expandedMap.value = {};
    if (row) {
        Object.assign(form, row);
        editingOptions.value = parseOptions(row.options);
    }
    else {
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
    }
    catch (err) {
        errorText.value = err?.message || '保存失败';
    }
}
async function onDelete(id) {
    await ElMessageBox.confirm('确认删除该配置？', '提示', { type: 'warning' });
    await deleteConfigApi(id);
    await loadData();
}
function renderLines(options) {
    const value = parseOptions(options);
    const lines = [];
    const walk = (node, depth, label) => {
        const t = nodeType(node);
        if (label) {
            lines.push({ key: `${depth}-${label}-${lines.length}`, name: label, value: formatValue(node), depth });
        }
        if (t === 'object') {
            Object.entries(node).forEach(([k, v]) => walk(v, depth + 1, k));
        }
        if (t === 'array') {
            node.forEach((v, idx) => walk(v, depth + 1, `[${idx}]`));
        }
    };
    if (nodeType(value) === 'object') {
        Object.entries(value).forEach(([k, v]) => walk(v, 0, k));
    }
    else if (nodeType(value) === 'array') {
        value.forEach((v, idx) => walk(v, 0, `[${idx}]`));
    }
    return lines;
}
function getRenderedLines(row) {
    const cacheKey = `${row.id || 'new'}:${row.updateTime || ''}:${row.options?.length || 0}`;
    const existed = lineCache.value[cacheKey];
    if (existed) {
        return existed;
    }
    const lines = renderLines(row.options);
    lineCache.value[cacheKey] = lines;
    return lines;
}
function nodeType(v) {
    if (Array.isArray(v))
        return 'array';
    if (v === null)
        return 'null';
    if (typeof v === 'number')
        return 'number';
    if (typeof v === 'boolean')
        return 'boolean';
    if (typeof v === 'object')
        return 'object';
    return 'string';
}
function typeDefaultValue(type) {
    if (type === 'object')
        return {};
    if (type === 'array')
        return [];
    if (type === 'number')
        return 0;
    if (type === 'boolean')
        return false;
    if (type === 'null')
        return null;
    return '';
}
function formatValue(v) {
    const t = nodeType(v);
    if (t === 'array')
        return `[${v.length}]`;
    if (t === 'object')
        return `{${Object.keys(v).length}}`;
    if (t === 'null')
        return 'null';
    return String(v);
}
function encodePath(path) {
    return path.map((seg) => (typeof seg === 'number' ? `n:${seg}` : `s:${encodeURIComponent(seg)}`)).join('|');
}
function decodePath(encoded) {
    if (!encoded)
        return [];
    return encoded.split('|').map((p) => (p.startsWith('n:') ? Number(p.slice(2)) : decodeURIComponent(p.slice(2))));
}
function isContainer(v) {
    return typeof v === 'object' && v !== null;
}
function getNode(path) {
    let cur = editingOptions.value;
    for (const seg of path) {
        if (!isContainer(cur))
            return '';
        cur = cur[seg];
    }
    return cur;
}
function getParentAndKey(path) {
    if (!path.length)
        return { parent: null, key: null };
    return { parent: getNode(path.slice(0, -1)), key: path[path.length - 1] };
}
function setNode(path, value) {
    if (!path.length) {
        editingOptions.value = value;
        return;
    }
    const { parent, key } = getParentAndKey(path);
    if (Array.isArray(parent)) {
        parent[key] = value;
        return;
    }
    if (parent && typeof parent === 'object') {
        parent[String(key)] = value;
    }
}
function removeNode(path) {
    if (!path.length)
        return;
    const { parent, key } = getParentAndKey(path);
    if (Array.isArray(parent)) {
        parent.splice(key, 1);
        return;
    }
    if (parent && typeof parent === 'object') {
        delete parent[String(key)];
    }
}
function addChild(path) {
    const target = getNode(path);
    if (Array.isArray(target)) {
        target.push('');
        return;
    }
    if (target && typeof target === 'object') {
        const obj = target;
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
function renameObjectKey(path, nextKey) {
    const trimmed = (nextKey || '').trim();
    if (!trimmed)
        throw new Error('字段名不能为空');
    const { parent, key } = getParentAndKey(path);
    if (!parent || Array.isArray(parent))
        return;
    const oldKey = String(key);
    if (trimmed === oldKey)
        return;
    if (Object.prototype.hasOwnProperty.call(parent, trimmed)) {
        throw new Error(`字段名重复: ${trimmed}`);
    }
    parent[trimmed] = parent[oldKey];
    delete parent[oldKey];
}
function flatten(root) {
    const nodes = [];
    const walk = (node, path, depth, keyLabel, inArray) => {
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
            Object.entries(node).forEach(([k, v]) => walk(v, path.concat(k), depth + 1, k, false));
        }
        if (type === 'array') {
            node.forEach((v, idx) => walk(v, path.concat(idx), depth + 1, idx, true));
        }
    };
    walk(root, [], 0, 'ROOT', false);
    return nodes;
}
function onChangeType(pathCode, nextType) {
    try {
        setNode(decodePath(pathCode), typeDefaultValue(nextType));
        errorText.value = '';
    }
    catch (err) {
        errorText.value = err?.message || '更新失败';
    }
}
function onChangeScalar(pathCode, raw) {
    try {
        const path = decodePath(pathCode);
        const t = nodeType(getNode(path));
        if (t === 'string') {
            setNode(path, raw);
        }
        if (t === 'number') {
            if (raw === '')
                throw new Error('数字类型不能为空');
            const n = Number(raw);
            if (Number.isNaN(n))
                throw new Error('数字类型必须输入合法数字');
            setNode(path, n);
        }
        errorText.value = '';
    }
    catch (err) {
        errorText.value = err?.message || '更新失败';
    }
}
function onChangeBoolean(pathCode, raw) {
    setNode(decodePath(pathCode), raw === 'true');
    errorText.value = '';
}
function onRenameKey(pathCode, nextKey) {
    try {
        renameObjectKey(decodePath(pathCode), nextKey);
        errorText.value = '';
    }
    catch (err) {
        errorText.value = err?.message || '更新失败';
    }
}
function onAddChild(pathCode) {
    addChild(decodePath(pathCode));
    errorText.value = '';
}
function onRemoveNode(pathCode) {
    removeNode(decodePath(pathCode));
    errorText.value = '';
}
function isExpanded(pathCode) {
    return expandedMap.value[pathCode] !== false;
}
function onToggleExpand(pathCode) {
    expandedMap.value[pathCode] = !isExpanded(pathCode);
}
function addRootChild() {
    const rootType = nodeType(editingOptions.value);
    if (rootType === 'object' || rootType === 'array') {
        addChild([]);
    }
    else {
        editingOptions.value = { newKey: '' };
    }
}
(async () => {
    await loadData();
})();
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['form-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['columns-head']} */ ;
/** @type {__VLS_StyleScopedClasses['fold-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['tree-row']} */ ;
/** @type {__VLS_StyleScopedClasses['tree-row']} */ ;
/** @type {__VLS_StyleScopedClasses['tree-row']} */ ;
/** @type {__VLS_StyleScopedClasses['tree-row']} */ ;
/** @type {__VLS_StyleScopedClasses['tree-row']} */ ;
/** @type {__VLS_StyleScopedClasses['ops-col']} */ ;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "toolbar" },
});
const __VLS_5 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    modelValue: (__VLS_ctx.query.keyword),
    placeholder: "范围ID/配置名称/标签",
    ...{ style: {} },
    clearable: true,
}));
const __VLS_7 = __VLS_6({
    modelValue: (__VLS_ctx.query.keyword),
    placeholder: "范围ID/配置名称/标签",
    ...{ style: {} },
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
const __VLS_9 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
    ...{ 'onClick': {} },
    type: "primary",
}));
const __VLS_11 = __VLS_10({
    ...{ 'onClick': {} },
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
let __VLS_13;
let __VLS_14;
let __VLS_15;
const __VLS_16 = {
    onClick: (__VLS_ctx.loadData)
};
__VLS_12.slots.default;
var __VLS_12;
const __VLS_17 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
    ...{ 'onClick': {} },
    type: "success",
}));
const __VLS_19 = __VLS_18({
    ...{ 'onClick': {} },
    type: "success",
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
let __VLS_21;
let __VLS_22;
let __VLS_23;
const __VLS_24 = {
    onClick: (...[$event]) => {
        __VLS_ctx.openDialog();
    }
};
__VLS_20.slots.default;
var __VLS_20;
const __VLS_25 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
    data: (__VLS_ctx.tableData),
    ...{ style: {} },
    border: true,
}));
const __VLS_27 = __VLS_26({
    data: (__VLS_ctx.tableData),
    ...{ style: {} },
    border: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
__VLS_28.slots.default;
const __VLS_29 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({
    prop: "id",
    label: "ID",
    width: "80",
}));
const __VLS_31 = __VLS_30({
    prop: "id",
    label: "ID",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_30));
const __VLS_33 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({
    prop: "scopeId",
    label: "范围ID",
    width: "140",
}));
const __VLS_35 = __VLS_34({
    prop: "scopeId",
    label: "范围ID",
    width: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_34));
const __VLS_37 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({
    prop: "configName",
    label: "配置名称",
    width: "180",
}));
const __VLS_39 = __VLS_38({
    prop: "configName",
    label: "配置名称",
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_38));
const __VLS_41 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({
    prop: "tags",
    label: "标记",
    showOverflowTooltip: true,
}));
const __VLS_43 = __VLS_42({
    prop: "tags",
    label: "标记",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_42));
const __VLS_45 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_46 = __VLS_asFunctionalComponent(__VLS_45, new __VLS_45({
    label: "options(JSON)",
    minWidth: "420",
}));
const __VLS_47 = __VLS_46({
    label: "options(JSON)",
    minWidth: "420",
}, ...__VLS_functionalComponentArgsRest(__VLS_46));
__VLS_48.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_48.slots;
    const [scope] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "config-cell" },
    });
    if (__VLS_ctx.getRenderedLines(scope.row).length) {
        for (const [line] of __VLS_getVForSourceType((__VLS_ctx.getRenderedLines(scope.row)))) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                key: (line.key),
                ...{ class: "kv" },
                ...{ style: ({ marginLeft: `${line.depth * 14}px` }) },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "k" },
            });
            (line.name);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "v" },
            });
            (line.value);
        }
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "muted" },
        });
    }
}
var __VLS_48;
const __VLS_49 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_50 = __VLS_asFunctionalComponent(__VLS_49, new __VLS_49({
    label: "状态",
    width: "100",
}));
const __VLS_51 = __VLS_50({
    label: "状态",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_50));
__VLS_52.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_52.slots;
    const [scope] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_53 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_54 = __VLS_asFunctionalComponent(__VLS_53, new __VLS_53({
        type: (scope.row.status === 1 ? 'success' : scope.row.status === 0 ? 'danger' : 'info'),
    }));
    const __VLS_55 = __VLS_54({
        type: (scope.row.status === 1 ? 'success' : scope.row.status === 0 ? 'danger' : 'info'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_54));
    __VLS_56.slots.default;
    (scope.row.status === 1 ? '启用' : scope.row.status === 0 ? '禁用' : '未知');
    var __VLS_56;
}
var __VLS_52;
const __VLS_57 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_58 = __VLS_asFunctionalComponent(__VLS_57, new __VLS_57({
    prop: "updateTime",
    label: "修改时间",
    width: "180",
}));
const __VLS_59 = __VLS_58({
    prop: "updateTime",
    label: "修改时间",
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_58));
const __VLS_61 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_62 = __VLS_asFunctionalComponent(__VLS_61, new __VLS_61({
    label: "操作",
    width: "160",
}));
const __VLS_63 = __VLS_62({
    label: "操作",
    width: "160",
}, ...__VLS_functionalComponentArgsRest(__VLS_62));
__VLS_64.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_64.slots;
    const [scope] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_65 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_66 = __VLS_asFunctionalComponent(__VLS_65, new __VLS_65({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_67 = __VLS_66({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_66));
    let __VLS_69;
    let __VLS_70;
    let __VLS_71;
    const __VLS_72 = {
        onClick: (...[$event]) => {
            __VLS_ctx.openDialog(scope.row);
        }
    };
    __VLS_68.slots.default;
    var __VLS_68;
    const __VLS_73 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_74 = __VLS_asFunctionalComponent(__VLS_73, new __VLS_73({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
    }));
    const __VLS_75 = __VLS_74({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_74));
    let __VLS_77;
    let __VLS_78;
    let __VLS_79;
    const __VLS_80 = {
        onClick: (...[$event]) => {
            __VLS_ctx.onDelete(scope.row.id);
        }
    };
    __VLS_76.slots.default;
    var __VLS_76;
}
var __VLS_64;
var __VLS_28;
const __VLS_81 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
// @ts-ignore
const __VLS_82 = __VLS_asFunctionalComponent(__VLS_81, new __VLS_81({
    ...{ 'onCurrentChange': {} },
    ...{ style: {} },
    background: true,
    layout: "total, prev, pager, next",
    total: (__VLS_ctx.total),
    pageSize: (__VLS_ctx.query.size),
    currentPage: (__VLS_ctx.query.current),
}));
const __VLS_83 = __VLS_82({
    ...{ 'onCurrentChange': {} },
    ...{ style: {} },
    background: true,
    layout: "total, prev, pager, next",
    total: (__VLS_ctx.total),
    pageSize: (__VLS_ctx.query.size),
    currentPage: (__VLS_ctx.query.current),
}, ...__VLS_functionalComponentArgsRest(__VLS_82));
let __VLS_85;
let __VLS_86;
let __VLS_87;
const __VLS_88 = {
    onCurrentChange: (__VLS_ctx.onPageChange)
};
var __VLS_84;
const __VLS_89 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_90 = __VLS_asFunctionalComponent(__VLS_89, new __VLS_89({
    modelValue: (__VLS_ctx.visible),
    title: (__VLS_ctx.form.id ? '编辑配置' : '新增配置'),
    width: "980px",
    top: "4vh",
}));
const __VLS_91 = __VLS_90({
    modelValue: (__VLS_ctx.visible),
    title: (__VLS_ctx.form.id ? '编辑配置' : '新增配置'),
    width: "980px",
    top: "4vh",
}, ...__VLS_functionalComponentArgsRest(__VLS_90));
__VLS_92.slots.default;
const __VLS_93 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_94 = __VLS_asFunctionalComponent(__VLS_93, new __VLS_93({
    model: (__VLS_ctx.form),
    labelWidth: "88px",
}));
const __VLS_95 = __VLS_94({
    model: (__VLS_ctx.form),
    labelWidth: "88px",
}, ...__VLS_functionalComponentArgsRest(__VLS_94));
__VLS_96.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "form-grid" },
});
const __VLS_97 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_98 = __VLS_asFunctionalComponent(__VLS_97, new __VLS_97({
    label: "范围ID",
}));
const __VLS_99 = __VLS_98({
    label: "范围ID",
}, ...__VLS_functionalComponentArgsRest(__VLS_98));
__VLS_100.slots.default;
const __VLS_101 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_102 = __VLS_asFunctionalComponent(__VLS_101, new __VLS_101({
    modelValue: (__VLS_ctx.form.scopeId),
}));
const __VLS_103 = __VLS_102({
    modelValue: (__VLS_ctx.form.scopeId),
}, ...__VLS_functionalComponentArgsRest(__VLS_102));
var __VLS_100;
const __VLS_105 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_106 = __VLS_asFunctionalComponent(__VLS_105, new __VLS_105({
    label: "配置名称",
}));
const __VLS_107 = __VLS_106({
    label: "配置名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_106));
__VLS_108.slots.default;
const __VLS_109 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_110 = __VLS_asFunctionalComponent(__VLS_109, new __VLS_109({
    modelValue: (__VLS_ctx.form.configName),
}));
const __VLS_111 = __VLS_110({
    modelValue: (__VLS_ctx.form.configName),
}, ...__VLS_functionalComponentArgsRest(__VLS_110));
var __VLS_108;
const __VLS_113 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_114 = __VLS_asFunctionalComponent(__VLS_113, new __VLS_113({
    label: "标签",
    ...{ class: "full" },
}));
const __VLS_115 = __VLS_114({
    label: "标签",
    ...{ class: "full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_114));
__VLS_116.slots.default;
const __VLS_117 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_118 = __VLS_asFunctionalComponent(__VLS_117, new __VLS_117({
    modelValue: (__VLS_ctx.form.tags),
}));
const __VLS_119 = __VLS_118({
    modelValue: (__VLS_ctx.form.tags),
}, ...__VLS_functionalComponentArgsRest(__VLS_118));
var __VLS_116;
const __VLS_121 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_122 = __VLS_asFunctionalComponent(__VLS_121, new __VLS_121({
    label: "状态",
}));
const __VLS_123 = __VLS_122({
    label: "状态",
}, ...__VLS_functionalComponentArgsRest(__VLS_122));
__VLS_124.slots.default;
const __VLS_125 = {}.ElRadioGroup;
/** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ ;
// @ts-ignore
const __VLS_126 = __VLS_asFunctionalComponent(__VLS_125, new __VLS_125({
    modelValue: (__VLS_ctx.form.status),
}));
const __VLS_127 = __VLS_126({
    modelValue: (__VLS_ctx.form.status),
}, ...__VLS_functionalComponentArgsRest(__VLS_126));
__VLS_128.slots.default;
const __VLS_129 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_130 = __VLS_asFunctionalComponent(__VLS_129, new __VLS_129({
    value: (1),
}));
const __VLS_131 = __VLS_130({
    value: (1),
}, ...__VLS_functionalComponentArgsRest(__VLS_130));
__VLS_132.slots.default;
var __VLS_132;
const __VLS_133 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_134 = __VLS_asFunctionalComponent(__VLS_133, new __VLS_133({
    value: (0),
}));
const __VLS_135 = __VLS_134({
    value: (0),
}, ...__VLS_functionalComponentArgsRest(__VLS_134));
__VLS_136.slots.default;
var __VLS_136;
var __VLS_128;
var __VLS_124;
var __VLS_96;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "editor-box" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "editor-head" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
const __VLS_137 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_138 = __VLS_asFunctionalComponent(__VLS_137, new __VLS_137({
    ...{ 'onClick': {} },
    type: "primary",
    size: "small",
}));
const __VLS_139 = __VLS_138({
    ...{ 'onClick': {} },
    type: "primary",
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_138));
let __VLS_141;
let __VLS_142;
let __VLS_143;
const __VLS_144 = {
    onClick: (__VLS_ctx.addRootChild)
};
__VLS_140.slots.default;
var __VLS_140;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "rows" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "columns-head" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "col-key" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "col-type" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "col-value" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "col-ops" },
});
for (const [node] of __VLS_getVForSourceType((__VLS_ctx.flatNodes))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (node.pathCode),
        ...{ class: "tree-row" },
        ...{ class: ([`depth-${Math.min(node.depth, 4)}`]) },
        ...{ style: ({ marginLeft: `${node.depth * 16}px` }) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "key-col" },
    });
    if (node.type === 'object' || node.type === 'array') {
        const __VLS_145 = {}.ElIcon;
        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
        // @ts-ignore
        const __VLS_146 = __VLS_asFunctionalComponent(__VLS_145, new __VLS_145({
            ...{ 'onClick': {} },
            ...{ class: "fold-icon" },
        }));
        const __VLS_147 = __VLS_146({
            ...{ 'onClick': {} },
            ...{ class: "fold-icon" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_146));
        let __VLS_149;
        let __VLS_150;
        let __VLS_151;
        const __VLS_152 = {
            onClick: (...[$event]) => {
                if (!(node.type === 'object' || node.type === 'array'))
                    return;
                __VLS_ctx.onToggleExpand(node.pathCode);
            }
        };
        __VLS_148.slots.default;
        if (__VLS_ctx.isExpanded(node.pathCode)) {
            const __VLS_153 = {}.CaretBottom;
            /** @type {[typeof __VLS_components.CaretBottom, ]} */ ;
            // @ts-ignore
            const __VLS_154 = __VLS_asFunctionalComponent(__VLS_153, new __VLS_153({}));
            const __VLS_155 = __VLS_154({}, ...__VLS_functionalComponentArgsRest(__VLS_154));
        }
        else {
            const __VLS_157 = {}.CaretRight;
            /** @type {[typeof __VLS_components.CaretRight, ]} */ ;
            // @ts-ignore
            const __VLS_158 = __VLS_asFunctionalComponent(__VLS_157, new __VLS_157({}));
            const __VLS_159 = __VLS_158({}, ...__VLS_functionalComponentArgsRest(__VLS_158));
        }
        var __VLS_148;
    }
    if (node.path.length === 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "node-name root" },
        });
    }
    else if (node.inArray) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "node-index" },
        });
        (node.lastSegment);
    }
    else {
        const __VLS_161 = {}.ElInput;
        /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
        // @ts-ignore
        const __VLS_162 = __VLS_asFunctionalComponent(__VLS_161, new __VLS_161({
            ...{ 'onChange': {} },
            modelValue: (String(node.keyLabel)),
            placeholder: "字段名",
        }));
        const __VLS_163 = __VLS_162({
            ...{ 'onChange': {} },
            modelValue: (String(node.keyLabel)),
            placeholder: "字段名",
        }, ...__VLS_functionalComponentArgsRest(__VLS_162));
        let __VLS_165;
        let __VLS_166;
        let __VLS_167;
        const __VLS_168 = {
            onChange: (...[$event]) => {
                if (!!(node.path.length === 0))
                    return;
                if (!!(node.inArray))
                    return;
                __VLS_ctx.onRenameKey(node.pathCode, String($event ?? ''));
            }
        };
        var __VLS_164;
    }
    if (node.path.length) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "path-hint" },
        });
        (__VLS_ctx.pathLabel(node));
    }
    const __VLS_169 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_170 = __VLS_asFunctionalComponent(__VLS_169, new __VLS_169({
        ...{ 'onChange': {} },
        modelValue: (node.type),
    }));
    const __VLS_171 = __VLS_170({
        ...{ 'onChange': {} },
        modelValue: (node.type),
    }, ...__VLS_functionalComponentArgsRest(__VLS_170));
    let __VLS_173;
    let __VLS_174;
    let __VLS_175;
    const __VLS_176 = {
        onChange: (...[$event]) => {
            __VLS_ctx.onChangeType(node.pathCode, String($event));
        }
    };
    __VLS_172.slots.default;
    const __VLS_177 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_178 = __VLS_asFunctionalComponent(__VLS_177, new __VLS_177({
        label: "字符串",
        value: "string",
    }));
    const __VLS_179 = __VLS_178({
        label: "字符串",
        value: "string",
    }, ...__VLS_functionalComponentArgsRest(__VLS_178));
    const __VLS_181 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_182 = __VLS_asFunctionalComponent(__VLS_181, new __VLS_181({
        label: "数字",
        value: "number",
    }));
    const __VLS_183 = __VLS_182({
        label: "数字",
        value: "number",
    }, ...__VLS_functionalComponentArgsRest(__VLS_182));
    const __VLS_185 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_186 = __VLS_asFunctionalComponent(__VLS_185, new __VLS_185({
        label: "布尔",
        value: "boolean",
    }));
    const __VLS_187 = __VLS_186({
        label: "布尔",
        value: "boolean",
    }, ...__VLS_functionalComponentArgsRest(__VLS_186));
    const __VLS_189 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_190 = __VLS_asFunctionalComponent(__VLS_189, new __VLS_189({
        label: "空值(null)",
        value: "null",
    }));
    const __VLS_191 = __VLS_190({
        label: "空值(null)",
        value: "null",
    }, ...__VLS_functionalComponentArgsRest(__VLS_190));
    const __VLS_193 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_194 = __VLS_asFunctionalComponent(__VLS_193, new __VLS_193({
        label: "数组",
        value: "array",
    }));
    const __VLS_195 = __VLS_194({
        label: "数组",
        value: "array",
    }, ...__VLS_functionalComponentArgsRest(__VLS_194));
    const __VLS_197 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_198 = __VLS_asFunctionalComponent(__VLS_197, new __VLS_197({
        label: "对象",
        value: "object",
    }));
    const __VLS_199 = __VLS_198({
        label: "对象",
        value: "object",
    }, ...__VLS_functionalComponentArgsRest(__VLS_198));
    var __VLS_172;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "value-col" },
    });
    if (node.type === 'boolean') {
        const __VLS_201 = {}.ElSelect;
        /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
        // @ts-ignore
        const __VLS_202 = __VLS_asFunctionalComponent(__VLS_201, new __VLS_201({
            ...{ 'onChange': {} },
            modelValue: (String(node.value)),
        }));
        const __VLS_203 = __VLS_202({
            ...{ 'onChange': {} },
            modelValue: (String(node.value)),
        }, ...__VLS_functionalComponentArgsRest(__VLS_202));
        let __VLS_205;
        let __VLS_206;
        let __VLS_207;
        const __VLS_208 = {
            onChange: (...[$event]) => {
                if (!(node.type === 'boolean'))
                    return;
                __VLS_ctx.onChangeBoolean(node.pathCode, String($event));
            }
        };
        __VLS_204.slots.default;
        const __VLS_209 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_210 = __VLS_asFunctionalComponent(__VLS_209, new __VLS_209({
            label: "true",
            value: "true",
        }));
        const __VLS_211 = __VLS_210({
            label: "true",
            value: "true",
        }, ...__VLS_functionalComponentArgsRest(__VLS_210));
        const __VLS_213 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_214 = __VLS_asFunctionalComponent(__VLS_213, new __VLS_213({
            label: "false",
            value: "false",
        }));
        const __VLS_215 = __VLS_214({
            label: "false",
            value: "false",
        }, ...__VLS_functionalComponentArgsRest(__VLS_214));
        var __VLS_204;
    }
    else if (node.type === 'null') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "node-count" },
        });
    }
    else if (node.type === 'object') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "node-count" },
        });
        (Object.keys(node.value).length);
    }
    else if (node.type === 'array') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "node-count" },
        });
        (node.value.length);
    }
    else {
        const __VLS_217 = {}.ElInput;
        /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
        // @ts-ignore
        const __VLS_218 = __VLS_asFunctionalComponent(__VLS_217, new __VLS_217({
            ...{ 'onInput': {} },
            type: (node.type === 'number' ? 'number' : 'text'),
            modelValue: (String(node.value ?? '')),
        }));
        const __VLS_219 = __VLS_218({
            ...{ 'onInput': {} },
            type: (node.type === 'number' ? 'number' : 'text'),
            modelValue: (String(node.value ?? '')),
        }, ...__VLS_functionalComponentArgsRest(__VLS_218));
        let __VLS_221;
        let __VLS_222;
        let __VLS_223;
        const __VLS_224 = {
            onInput: (...[$event]) => {
                if (!!(node.type === 'boolean'))
                    return;
                if (!!(node.type === 'null'))
                    return;
                if (!!(node.type === 'object'))
                    return;
                if (!!(node.type === 'array'))
                    return;
                __VLS_ctx.onChangeScalar(node.pathCode, String($event ?? ''));
            }
        };
        var __VLS_220;
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "ops-col" },
    });
    if (node.type === 'object' || node.type === 'array') {
        const __VLS_225 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_226 = __VLS_asFunctionalComponent(__VLS_225, new __VLS_225({
            ...{ 'onClick': {} },
            size: "small",
        }));
        const __VLS_227 = __VLS_226({
            ...{ 'onClick': {} },
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_226));
        let __VLS_229;
        let __VLS_230;
        let __VLS_231;
        const __VLS_232 = {
            onClick: (...[$event]) => {
                if (!(node.type === 'object' || node.type === 'array'))
                    return;
                __VLS_ctx.onAddChild(node.pathCode);
            }
        };
        __VLS_228.slots.default;
        var __VLS_228;
    }
    if (node.path.length > 0) {
        const __VLS_233 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_234 = __VLS_asFunctionalComponent(__VLS_233, new __VLS_233({
            ...{ 'onClick': {} },
            size: "small",
            type: "danger",
        }));
        const __VLS_235 = __VLS_234({
            ...{ 'onClick': {} },
            size: "small",
            type: "danger",
        }, ...__VLS_functionalComponentArgsRest(__VLS_234));
        let __VLS_237;
        let __VLS_238;
        let __VLS_239;
        const __VLS_240 = {
            onClick: (...[$event]) => {
                if (!(node.path.length > 0))
                    return;
                __VLS_ctx.onRemoveNode(node.pathCode);
            }
        };
        __VLS_236.slots.default;
        var __VLS_236;
    }
}
if (!__VLS_ctx.flatNodes.length) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "empty" },
    });
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "preview-title" },
});
const __VLS_241 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_242 = __VLS_asFunctionalComponent(__VLS_241, new __VLS_241({
    type: "textarea",
    rows: (10),
    modelValue: (__VLS_ctx.jsonPreview),
    readonly: true,
}));
const __VLS_243 = __VLS_242({
    type: "textarea",
    rows: (10),
    modelValue: (__VLS_ctx.jsonPreview),
    readonly: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_242));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "error-text" },
});
(__VLS_ctx.errorText);
{
    const { footer: __VLS_thisSlot } = __VLS_92.slots;
    const __VLS_245 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_246 = __VLS_asFunctionalComponent(__VLS_245, new __VLS_245({
        ...{ 'onClick': {} },
    }));
    const __VLS_247 = __VLS_246({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_246));
    let __VLS_249;
    let __VLS_250;
    let __VLS_251;
    const __VLS_252 = {
        onClick: (...[$event]) => {
            __VLS_ctx.visible = false;
        }
    };
    __VLS_248.slots.default;
    var __VLS_248;
    const __VLS_253 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_254 = __VLS_asFunctionalComponent(__VLS_253, new __VLS_253({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_255 = __VLS_254({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_254));
    let __VLS_257;
    let __VLS_258;
    let __VLS_259;
    const __VLS_260 = {
        onClick: (__VLS_ctx.onSubmit)
    };
    __VLS_256.slots.default;
    var __VLS_256;
}
var __VLS_92;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['toolbar']} */ ;
/** @type {__VLS_StyleScopedClasses['config-cell']} */ ;
/** @type {__VLS_StyleScopedClasses['kv']} */ ;
/** @type {__VLS_StyleScopedClasses['k']} */ ;
/** @type {__VLS_StyleScopedClasses['v']} */ ;
/** @type {__VLS_StyleScopedClasses['muted']} */ ;
/** @type {__VLS_StyleScopedClasses['form-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['full']} */ ;
/** @type {__VLS_StyleScopedClasses['editor-box']} */ ;
/** @type {__VLS_StyleScopedClasses['editor-head']} */ ;
/** @type {__VLS_StyleScopedClasses['rows']} */ ;
/** @type {__VLS_StyleScopedClasses['columns-head']} */ ;
/** @type {__VLS_StyleScopedClasses['col-key']} */ ;
/** @type {__VLS_StyleScopedClasses['col-type']} */ ;
/** @type {__VLS_StyleScopedClasses['col-value']} */ ;
/** @type {__VLS_StyleScopedClasses['col-ops']} */ ;
/** @type {__VLS_StyleScopedClasses['tree-row']} */ ;
/** @type {__VLS_StyleScopedClasses['key-col']} */ ;
/** @type {__VLS_StyleScopedClasses['fold-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['node-name']} */ ;
/** @type {__VLS_StyleScopedClasses['root']} */ ;
/** @type {__VLS_StyleScopedClasses['node-index']} */ ;
/** @type {__VLS_StyleScopedClasses['path-hint']} */ ;
/** @type {__VLS_StyleScopedClasses['value-col']} */ ;
/** @type {__VLS_StyleScopedClasses['node-count']} */ ;
/** @type {__VLS_StyleScopedClasses['node-count']} */ ;
/** @type {__VLS_StyleScopedClasses['node-count']} */ ;
/** @type {__VLS_StyleScopedClasses['ops-col']} */ ;
/** @type {__VLS_StyleScopedClasses['empty']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-title']} */ ;
/** @type {__VLS_StyleScopedClasses['error-text']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            CaretBottom: CaretBottom,
            CaretRight: CaretRight,
            query: query,
            total: total,
            tableData: tableData,
            visible: visible,
            errorText: errorText,
            form: form,
            flatNodes: flatNodes,
            jsonPreview: jsonPreview,
            pathLabel: pathLabel,
            loadData: loadData,
            onPageChange: onPageChange,
            openDialog: openDialog,
            onSubmit: onSubmit,
            onDelete: onDelete,
            getRenderedLines: getRenderedLines,
            onChangeType: onChangeType,
            onChangeScalar: onChangeScalar,
            onChangeBoolean: onChangeBoolean,
            onRenameKey: onRenameKey,
            onAddChild: onAddChild,
            onRemoveNode: onRemoveNode,
            isExpanded: isExpanded,
            onToggleExpand: onToggleExpand,
            addRootChild: addRootChild,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
