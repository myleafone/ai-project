import { nextTick, reactive, ref } from 'vue';
import { ElMessageBox } from 'element-plus';
import { deleteRoleApi, pageRoleApi, roleMenuIdsApi, saveRoleApi } from './api';
import { listMenuApi } from '@/modules/system/menu/api';
import { buildTree } from '@/modules/system/shared/tree';
const query = reactive({ current: 1, size: 10, keyword: '' });
const total = ref(0);
const tableData = ref([]);
const visible = ref(false);
const form = reactive({ roleCode: '', roleName: '', remark: '', menuIds: [] });
const menuTree = ref([]);
const treeRef = ref();
async function loadMenus() {
    menuTree.value = buildTree(await listMenuApi());
}
async function loadData() {
    const data = await pageRoleApi(query);
    tableData.value = data.records;
    total.value = data.total;
}
function onPageChange(page) {
    query.current = page;
    loadData();
}
async function openDialog(row) {
    treeRef.value?.setCheckedKeys([]);
    if (row?.id) {
        Object.assign(form, row);
        form.menuIds = await roleMenuIdsApi(row.id);
    }
    else {
        Object.assign(form, { id: undefined, roleCode: '', roleName: '', remark: '', menuIds: [] });
    }
    visible.value = true;
    await nextTick();
    treeRef.value?.setCheckedKeys(form.menuIds || []);
}
async function onSubmit() {
    const checkedKeys = treeRef.value?.getCheckedKeys(false) || [];
    const halfCheckedKeys = treeRef.value?.getHalfCheckedKeys() || [];
    form.menuIds = [...new Set([...checkedKeys, ...halfCheckedKeys])];
    await saveRoleApi(form);
    visible.value = false;
    await loadData();
}
async function onDelete(id) {
    await ElMessageBox.confirm('确认删除该角色？', '提示', { type: 'warning' });
    await deleteRoleApi(id);
    await loadData();
}
(async () => {
    await loadMenus();
    await loadData();
})();
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
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
    placeholder: "角色编码/角色名称",
    ...{ style: {} },
    clearable: true,
}));
const __VLS_7 = __VLS_6({
    modelValue: (__VLS_ctx.query.keyword),
    placeholder: "角色编码/角色名称",
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
    prop: "roleCode",
    label: "角色编码",
}));
const __VLS_35 = __VLS_34({
    prop: "roleCode",
    label: "角色编码",
}, ...__VLS_functionalComponentArgsRest(__VLS_34));
const __VLS_37 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({
    prop: "roleName",
    label: "角色名称",
}));
const __VLS_39 = __VLS_38({
    prop: "roleName",
    label: "角色名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_38));
const __VLS_41 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({
    prop: "remark",
    label: "备注",
}));
const __VLS_43 = __VLS_42({
    prop: "remark",
    label: "备注",
}, ...__VLS_functionalComponentArgsRest(__VLS_42));
const __VLS_45 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_46 = __VLS_asFunctionalComponent(__VLS_45, new __VLS_45({
    label: "操作",
    width: "180",
}));
const __VLS_47 = __VLS_46({
    label: "操作",
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_46));
__VLS_48.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_48.slots;
    const [scope] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_49 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_50 = __VLS_asFunctionalComponent(__VLS_49, new __VLS_49({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_51 = __VLS_50({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_50));
    let __VLS_53;
    let __VLS_54;
    let __VLS_55;
    const __VLS_56 = {
        onClick: (...[$event]) => {
            __VLS_ctx.openDialog(scope.row);
        }
    };
    __VLS_52.slots.default;
    var __VLS_52;
    const __VLS_57 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_58 = __VLS_asFunctionalComponent(__VLS_57, new __VLS_57({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
    }));
    const __VLS_59 = __VLS_58({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_58));
    let __VLS_61;
    let __VLS_62;
    let __VLS_63;
    const __VLS_64 = {
        onClick: (...[$event]) => {
            __VLS_ctx.onDelete(scope.row.id);
        }
    };
    __VLS_60.slots.default;
    var __VLS_60;
}
var __VLS_48;
var __VLS_28;
const __VLS_65 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
// @ts-ignore
const __VLS_66 = __VLS_asFunctionalComponent(__VLS_65, new __VLS_65({
    ...{ 'onCurrentChange': {} },
    ...{ style: {} },
    background: true,
    layout: "total, prev, pager, next",
    total: (__VLS_ctx.total),
    pageSize: (__VLS_ctx.query.size),
    currentPage: (__VLS_ctx.query.current),
}));
const __VLS_67 = __VLS_66({
    ...{ 'onCurrentChange': {} },
    ...{ style: {} },
    background: true,
    layout: "total, prev, pager, next",
    total: (__VLS_ctx.total),
    pageSize: (__VLS_ctx.query.size),
    currentPage: (__VLS_ctx.query.current),
}, ...__VLS_functionalComponentArgsRest(__VLS_66));
let __VLS_69;
let __VLS_70;
let __VLS_71;
const __VLS_72 = {
    onCurrentChange: (__VLS_ctx.onPageChange)
};
var __VLS_68;
const __VLS_73 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_74 = __VLS_asFunctionalComponent(__VLS_73, new __VLS_73({
    modelValue: (__VLS_ctx.visible),
    title: (__VLS_ctx.form.id ? '编辑角色' : '新增角色'),
    width: "680px",
}));
const __VLS_75 = __VLS_74({
    modelValue: (__VLS_ctx.visible),
    title: (__VLS_ctx.form.id ? '编辑角色' : '新增角色'),
    width: "680px",
}, ...__VLS_functionalComponentArgsRest(__VLS_74));
__VLS_76.slots.default;
const __VLS_77 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_78 = __VLS_asFunctionalComponent(__VLS_77, new __VLS_77({
    model: (__VLS_ctx.form),
    labelWidth: "90px",
}));
const __VLS_79 = __VLS_78({
    model: (__VLS_ctx.form),
    labelWidth: "90px",
}, ...__VLS_functionalComponentArgsRest(__VLS_78));
__VLS_80.slots.default;
const __VLS_81 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_82 = __VLS_asFunctionalComponent(__VLS_81, new __VLS_81({
    label: "角色编码",
}));
const __VLS_83 = __VLS_82({
    label: "角色编码",
}, ...__VLS_functionalComponentArgsRest(__VLS_82));
__VLS_84.slots.default;
const __VLS_85 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_86 = __VLS_asFunctionalComponent(__VLS_85, new __VLS_85({
    modelValue: (__VLS_ctx.form.roleCode),
}));
const __VLS_87 = __VLS_86({
    modelValue: (__VLS_ctx.form.roleCode),
}, ...__VLS_functionalComponentArgsRest(__VLS_86));
var __VLS_84;
const __VLS_89 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_90 = __VLS_asFunctionalComponent(__VLS_89, new __VLS_89({
    label: "角色名称",
}));
const __VLS_91 = __VLS_90({
    label: "角色名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_90));
__VLS_92.slots.default;
const __VLS_93 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_94 = __VLS_asFunctionalComponent(__VLS_93, new __VLS_93({
    modelValue: (__VLS_ctx.form.roleName),
}));
const __VLS_95 = __VLS_94({
    modelValue: (__VLS_ctx.form.roleName),
}, ...__VLS_functionalComponentArgsRest(__VLS_94));
var __VLS_92;
const __VLS_97 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_98 = __VLS_asFunctionalComponent(__VLS_97, new __VLS_97({
    label: "备注",
}));
const __VLS_99 = __VLS_98({
    label: "备注",
}, ...__VLS_functionalComponentArgsRest(__VLS_98));
__VLS_100.slots.default;
const __VLS_101 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_102 = __VLS_asFunctionalComponent(__VLS_101, new __VLS_101({
    modelValue: (__VLS_ctx.form.remark),
}));
const __VLS_103 = __VLS_102({
    modelValue: (__VLS_ctx.form.remark),
}, ...__VLS_functionalComponentArgsRest(__VLS_102));
var __VLS_100;
const __VLS_105 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_106 = __VLS_asFunctionalComponent(__VLS_105, new __VLS_105({
    label: "菜单权限",
}));
const __VLS_107 = __VLS_106({
    label: "菜单权限",
}, ...__VLS_functionalComponentArgsRest(__VLS_106));
__VLS_108.slots.default;
const __VLS_109 = {}.ElTree;
/** @type {[typeof __VLS_components.ElTree, typeof __VLS_components.elTree, ]} */ ;
// @ts-ignore
const __VLS_110 = __VLS_asFunctionalComponent(__VLS_109, new __VLS_109({
    ref: "treeRef",
    ...{ style: {} },
    showCheckbox: true,
    nodeKey: "id",
    data: (__VLS_ctx.menuTree),
    props: ({ label: 'menuName', children: 'children' }),
    defaultExpandAll: true,
}));
const __VLS_111 = __VLS_110({
    ref: "treeRef",
    ...{ style: {} },
    showCheckbox: true,
    nodeKey: "id",
    data: (__VLS_ctx.menuTree),
    props: ({ label: 'menuName', children: 'children' }),
    defaultExpandAll: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_110));
/** @type {typeof __VLS_ctx.treeRef} */ ;
var __VLS_113 = {};
var __VLS_112;
var __VLS_108;
var __VLS_80;
{
    const { footer: __VLS_thisSlot } = __VLS_76.slots;
    const __VLS_115 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_116 = __VLS_asFunctionalComponent(__VLS_115, new __VLS_115({
        ...{ 'onClick': {} },
    }));
    const __VLS_117 = __VLS_116({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_116));
    let __VLS_119;
    let __VLS_120;
    let __VLS_121;
    const __VLS_122 = {
        onClick: (...[$event]) => {
            __VLS_ctx.visible = false;
        }
    };
    __VLS_118.slots.default;
    var __VLS_118;
    const __VLS_123 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_124 = __VLS_asFunctionalComponent(__VLS_123, new __VLS_123({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_125 = __VLS_124({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_124));
    let __VLS_127;
    let __VLS_128;
    let __VLS_129;
    const __VLS_130 = {
        onClick: (__VLS_ctx.onSubmit)
    };
    __VLS_126.slots.default;
    var __VLS_126;
}
var __VLS_76;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['toolbar']} */ ;
// @ts-ignore
var __VLS_114 = __VLS_113;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            query: query,
            total: total,
            tableData: tableData,
            visible: visible,
            form: form,
            menuTree: menuTree,
            treeRef: treeRef,
            loadData: loadData,
            onPageChange: onPageChange,
            openDialog: openDialog,
            onSubmit: onSubmit,
            onDelete: onDelete,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
