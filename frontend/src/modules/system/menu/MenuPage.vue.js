import { computed, reactive, ref } from 'vue';
import { ElMessageBox } from 'element-plus';
import { deleteMenuApi, listMenuApi, saveMenuApi } from './api';
import { buildTree } from '@/modules/system/shared/tree';
const visible = ref(false);
const list = ref([]);
const form = reactive({
    parentId: 0,
    menuName: '',
    path: '',
    component: '',
    icon: '',
    sort: 0,
    menuType: 2,
    perms: ''
});
const tableTree = computed(() => buildTree(list.value));
const parentOptions = computed(() => list.value.filter((m) => m.menuType !== 3));
function typeLabel(type) {
    return type === 1 ? '目录' : type === 2 ? '菜单' : '按钮';
}
async function loadData() {
    list.value = await listMenuApi();
}
function openDialog(row) {
    if (row) {
        Object.assign(form, row);
    }
    else {
        Object.assign(form, { id: undefined, parentId: 0, menuName: '', path: '', component: '', icon: '', sort: 0, menuType: 2, perms: '' });
    }
    visible.value = true;
}
async function onSubmit() {
    await saveMenuApi(form);
    visible.value = false;
    await loadData();
}
async function onDelete(id) {
    await ElMessageBox.confirm('确认删除该菜单？', '提示', { type: 'warning' });
    await deleteMenuApi(id);
    await loadData();
}
loadData();
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
const __VLS_5 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    ...{ 'onClick': {} },
    type: "success",
}));
const __VLS_7 = __VLS_6({
    ...{ 'onClick': {} },
    type: "success",
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
let __VLS_9;
let __VLS_10;
let __VLS_11;
const __VLS_12 = {
    onClick: (...[$event]) => {
        __VLS_ctx.openDialog();
    }
};
__VLS_8.slots.default;
var __VLS_8;
const __VLS_13 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
    ...{ 'onClick': {} },
}));
const __VLS_15 = __VLS_14({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
let __VLS_17;
let __VLS_18;
let __VLS_19;
const __VLS_20 = {
    onClick: (__VLS_ctx.loadData)
};
__VLS_16.slots.default;
var __VLS_16;
const __VLS_21 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
    data: (__VLS_ctx.tableTree),
    border: true,
    rowKey: "id",
    treeProps: ({ children: 'children' }),
    ...{ style: {} },
}));
const __VLS_23 = __VLS_22({
    data: (__VLS_ctx.tableTree),
    border: true,
    rowKey: "id",
    treeProps: ({ children: 'children' }),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_22));
__VLS_24.slots.default;
const __VLS_25 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
    prop: "id",
    label: "ID",
    width: "80",
}));
const __VLS_27 = __VLS_26({
    prop: "id",
    label: "ID",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
const __VLS_29 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({
    prop: "menuName",
    label: "菜单名称",
}));
const __VLS_31 = __VLS_30({
    prop: "menuName",
    label: "菜单名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_30));
const __VLS_33 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({
    prop: "path",
    label: "路由路径",
}));
const __VLS_35 = __VLS_34({
    prop: "path",
    label: "路由路径",
}, ...__VLS_functionalComponentArgsRest(__VLS_34));
const __VLS_37 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({
    prop: "component",
    label: "组件路径",
}));
const __VLS_39 = __VLS_38({
    prop: "component",
    label: "组件路径",
}, ...__VLS_functionalComponentArgsRest(__VLS_38));
const __VLS_41 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({
    prop: "menuType",
    label: "类型",
    width: "100",
}));
const __VLS_43 = __VLS_42({
    prop: "menuType",
    label: "类型",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_42));
__VLS_44.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_44.slots;
    const [scope] = __VLS_getSlotParams(__VLS_thisSlot);
    (__VLS_ctx.typeLabel(scope.row.menuType));
}
var __VLS_44;
const __VLS_45 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_46 = __VLS_asFunctionalComponent(__VLS_45, new __VLS_45({
    prop: "sort",
    label: "排序",
    width: "80",
}));
const __VLS_47 = __VLS_46({
    prop: "sort",
    label: "排序",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_46));
const __VLS_49 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_50 = __VLS_asFunctionalComponent(__VLS_49, new __VLS_49({
    label: "操作",
    width: "180",
}));
const __VLS_51 = __VLS_50({
    label: "操作",
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_50));
__VLS_52.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_52.slots;
    const [scope] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_53 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_54 = __VLS_asFunctionalComponent(__VLS_53, new __VLS_53({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_55 = __VLS_54({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_54));
    let __VLS_57;
    let __VLS_58;
    let __VLS_59;
    const __VLS_60 = {
        onClick: (...[$event]) => {
            __VLS_ctx.openDialog(scope.row);
        }
    };
    __VLS_56.slots.default;
    var __VLS_56;
    const __VLS_61 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_62 = __VLS_asFunctionalComponent(__VLS_61, new __VLS_61({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
    }));
    const __VLS_63 = __VLS_62({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_62));
    let __VLS_65;
    let __VLS_66;
    let __VLS_67;
    const __VLS_68 = {
        onClick: (...[$event]) => {
            __VLS_ctx.onDelete(scope.row.id);
        }
    };
    __VLS_64.slots.default;
    var __VLS_64;
}
var __VLS_52;
var __VLS_24;
const __VLS_69 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_70 = __VLS_asFunctionalComponent(__VLS_69, new __VLS_69({
    modelValue: (__VLS_ctx.visible),
    title: (__VLS_ctx.form.id ? '编辑菜单' : '新增菜单'),
    width: "600px",
}));
const __VLS_71 = __VLS_70({
    modelValue: (__VLS_ctx.visible),
    title: (__VLS_ctx.form.id ? '编辑菜单' : '新增菜单'),
    width: "600px",
}, ...__VLS_functionalComponentArgsRest(__VLS_70));
__VLS_72.slots.default;
const __VLS_73 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_74 = __VLS_asFunctionalComponent(__VLS_73, new __VLS_73({
    model: (__VLS_ctx.form),
    labelWidth: "90px",
}));
const __VLS_75 = __VLS_74({
    model: (__VLS_ctx.form),
    labelWidth: "90px",
}, ...__VLS_functionalComponentArgsRest(__VLS_74));
__VLS_76.slots.default;
const __VLS_77 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_78 = __VLS_asFunctionalComponent(__VLS_77, new __VLS_77({
    label: "上级菜单",
}));
const __VLS_79 = __VLS_78({
    label: "上级菜单",
}, ...__VLS_functionalComponentArgsRest(__VLS_78));
__VLS_80.slots.default;
const __VLS_81 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_82 = __VLS_asFunctionalComponent(__VLS_81, new __VLS_81({
    modelValue: (__VLS_ctx.form.parentId),
    ...{ style: {} },
}));
const __VLS_83 = __VLS_82({
    modelValue: (__VLS_ctx.form.parentId),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_82));
__VLS_84.slots.default;
const __VLS_85 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_86 = __VLS_asFunctionalComponent(__VLS_85, new __VLS_85({
    value: (0),
    label: "顶级菜单",
}));
const __VLS_87 = __VLS_86({
    value: (0),
    label: "顶级菜单",
}, ...__VLS_functionalComponentArgsRest(__VLS_86));
for (const [m] of __VLS_getVForSourceType((__VLS_ctx.parentOptions))) {
    const __VLS_89 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_90 = __VLS_asFunctionalComponent(__VLS_89, new __VLS_89({
        key: (m.id),
        value: (m.id),
        label: (m.menuName),
    }));
    const __VLS_91 = __VLS_90({
        key: (m.id),
        value: (m.id),
        label: (m.menuName),
    }, ...__VLS_functionalComponentArgsRest(__VLS_90));
}
var __VLS_84;
var __VLS_80;
const __VLS_93 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_94 = __VLS_asFunctionalComponent(__VLS_93, new __VLS_93({
    label: "菜单名称",
}));
const __VLS_95 = __VLS_94({
    label: "菜单名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_94));
__VLS_96.slots.default;
const __VLS_97 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_98 = __VLS_asFunctionalComponent(__VLS_97, new __VLS_97({
    modelValue: (__VLS_ctx.form.menuName),
}));
const __VLS_99 = __VLS_98({
    modelValue: (__VLS_ctx.form.menuName),
}, ...__VLS_functionalComponentArgsRest(__VLS_98));
var __VLS_96;
const __VLS_101 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_102 = __VLS_asFunctionalComponent(__VLS_101, new __VLS_101({
    label: "路由路径",
}));
const __VLS_103 = __VLS_102({
    label: "路由路径",
}, ...__VLS_functionalComponentArgsRest(__VLS_102));
__VLS_104.slots.default;
const __VLS_105 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_106 = __VLS_asFunctionalComponent(__VLS_105, new __VLS_105({
    modelValue: (__VLS_ctx.form.path),
}));
const __VLS_107 = __VLS_106({
    modelValue: (__VLS_ctx.form.path),
}, ...__VLS_functionalComponentArgsRest(__VLS_106));
var __VLS_104;
const __VLS_109 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_110 = __VLS_asFunctionalComponent(__VLS_109, new __VLS_109({
    label: "组件路径",
}));
const __VLS_111 = __VLS_110({
    label: "组件路径",
}, ...__VLS_functionalComponentArgsRest(__VLS_110));
__VLS_112.slots.default;
const __VLS_113 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_114 = __VLS_asFunctionalComponent(__VLS_113, new __VLS_113({
    modelValue: (__VLS_ctx.form.component),
}));
const __VLS_115 = __VLS_114({
    modelValue: (__VLS_ctx.form.component),
}, ...__VLS_functionalComponentArgsRest(__VLS_114));
var __VLS_112;
const __VLS_117 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_118 = __VLS_asFunctionalComponent(__VLS_117, new __VLS_117({
    label: "图标",
}));
const __VLS_119 = __VLS_118({
    label: "图标",
}, ...__VLS_functionalComponentArgsRest(__VLS_118));
__VLS_120.slots.default;
const __VLS_121 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_122 = __VLS_asFunctionalComponent(__VLS_121, new __VLS_121({
    modelValue: (__VLS_ctx.form.icon),
}));
const __VLS_123 = __VLS_122({
    modelValue: (__VLS_ctx.form.icon),
}, ...__VLS_functionalComponentArgsRest(__VLS_122));
var __VLS_120;
const __VLS_125 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_126 = __VLS_asFunctionalComponent(__VLS_125, new __VLS_125({
    label: "排序",
}));
const __VLS_127 = __VLS_126({
    label: "排序",
}, ...__VLS_functionalComponentArgsRest(__VLS_126));
__VLS_128.slots.default;
const __VLS_129 = {}.ElInputNumber;
/** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
// @ts-ignore
const __VLS_130 = __VLS_asFunctionalComponent(__VLS_129, new __VLS_129({
    modelValue: (__VLS_ctx.form.sort),
    min: (0),
}));
const __VLS_131 = __VLS_130({
    modelValue: (__VLS_ctx.form.sort),
    min: (0),
}, ...__VLS_functionalComponentArgsRest(__VLS_130));
var __VLS_128;
const __VLS_133 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_134 = __VLS_asFunctionalComponent(__VLS_133, new __VLS_133({
    label: "类型",
}));
const __VLS_135 = __VLS_134({
    label: "类型",
}, ...__VLS_functionalComponentArgsRest(__VLS_134));
__VLS_136.slots.default;
const __VLS_137 = {}.ElRadioGroup;
/** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ ;
// @ts-ignore
const __VLS_138 = __VLS_asFunctionalComponent(__VLS_137, new __VLS_137({
    modelValue: (__VLS_ctx.form.menuType),
}));
const __VLS_139 = __VLS_138({
    modelValue: (__VLS_ctx.form.menuType),
}, ...__VLS_functionalComponentArgsRest(__VLS_138));
__VLS_140.slots.default;
const __VLS_141 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_142 = __VLS_asFunctionalComponent(__VLS_141, new __VLS_141({
    value: (1),
}));
const __VLS_143 = __VLS_142({
    value: (1),
}, ...__VLS_functionalComponentArgsRest(__VLS_142));
__VLS_144.slots.default;
var __VLS_144;
const __VLS_145 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_146 = __VLS_asFunctionalComponent(__VLS_145, new __VLS_145({
    value: (2),
}));
const __VLS_147 = __VLS_146({
    value: (2),
}, ...__VLS_functionalComponentArgsRest(__VLS_146));
__VLS_148.slots.default;
var __VLS_148;
const __VLS_149 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_150 = __VLS_asFunctionalComponent(__VLS_149, new __VLS_149({
    value: (3),
}));
const __VLS_151 = __VLS_150({
    value: (3),
}, ...__VLS_functionalComponentArgsRest(__VLS_150));
__VLS_152.slots.default;
var __VLS_152;
var __VLS_140;
var __VLS_136;
const __VLS_153 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_154 = __VLS_asFunctionalComponent(__VLS_153, new __VLS_153({
    label: "权限标识",
}));
const __VLS_155 = __VLS_154({
    label: "权限标识",
}, ...__VLS_functionalComponentArgsRest(__VLS_154));
__VLS_156.slots.default;
const __VLS_157 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_158 = __VLS_asFunctionalComponent(__VLS_157, new __VLS_157({
    modelValue: (__VLS_ctx.form.perms),
}));
const __VLS_159 = __VLS_158({
    modelValue: (__VLS_ctx.form.perms),
}, ...__VLS_functionalComponentArgsRest(__VLS_158));
var __VLS_156;
var __VLS_76;
{
    const { footer: __VLS_thisSlot } = __VLS_72.slots;
    const __VLS_161 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_162 = __VLS_asFunctionalComponent(__VLS_161, new __VLS_161({
        ...{ 'onClick': {} },
    }));
    const __VLS_163 = __VLS_162({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_162));
    let __VLS_165;
    let __VLS_166;
    let __VLS_167;
    const __VLS_168 = {
        onClick: (...[$event]) => {
            __VLS_ctx.visible = false;
        }
    };
    __VLS_164.slots.default;
    var __VLS_164;
    const __VLS_169 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_170 = __VLS_asFunctionalComponent(__VLS_169, new __VLS_169({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_171 = __VLS_170({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_170));
    let __VLS_173;
    let __VLS_174;
    let __VLS_175;
    const __VLS_176 = {
        onClick: (__VLS_ctx.onSubmit)
    };
    __VLS_172.slots.default;
    var __VLS_172;
}
var __VLS_72;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['toolbar']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            visible: visible,
            form: form,
            tableTree: tableTree,
            parentOptions: parentOptions,
            typeLabel: typeLabel,
            loadData: loadData,
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
