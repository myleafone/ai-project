import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';
const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const displayMenus = computed(() => {
    const menus = JSON.parse(JSON.stringify(authStore.menus || []));
    const configItem = {
        id: -10001,
        parentId: -10000,
        menuName: '配置管理',
        path: 'system/config',
        component: 'system/ConfigView',
        menuType: 2,
        sort: 9999,
        perms: 'system:config:list'
    };
    const systemRoot = menus.find((m) => m.menuName === '系统管理' || m.path === 'system');
    if (systemRoot) {
        const children = systemRoot.children || [];
        if (!children.some((c) => c.path === 'system/config')) {
            systemRoot.children = [...children, configItem];
        }
        return menus;
    }
    return [
        ...menus,
        {
            id: -10000,
            parentId: 0,
            menuName: '系统管理',
            path: 'system',
            component: '',
            menuType: 1,
            sort: 9998,
            children: [configItem]
        }
    ];
});
const username = computed(() => authStore.username || 'admin');
const activePath = computed(() => route.path);
function onLogout() {
    authStore.logout();
    router.replace('/login');
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "layout" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.aside, __VLS_intrinsicElements.aside)({
    ...{ class: "sidebar" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "logo" },
});
const __VLS_0 = {}.ElMenu;
/** @type {[typeof __VLS_components.ElMenu, typeof __VLS_components.elMenu, typeof __VLS_components.ElMenu, typeof __VLS_components.elMenu, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    defaultActive: (__VLS_ctx.activePath),
    router: true,
}));
const __VLS_2 = __VLS_1({
    defaultActive: (__VLS_ctx.activePath),
    router: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
const __VLS_4 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    index: "/dashboard",
}));
const __VLS_6 = __VLS_5({
    index: "/dashboard",
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
var __VLS_7;
for (const [m] of __VLS_getVForSourceType((__VLS_ctx.displayMenus))) {
    (m.id);
    if (m.children && m.children.length) {
        const __VLS_8 = {}.ElSubMenu;
        /** @type {[typeof __VLS_components.ElSubMenu, typeof __VLS_components.elSubMenu, typeof __VLS_components.ElSubMenu, typeof __VLS_components.elSubMenu, ]} */ ;
        // @ts-ignore
        const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
            index: (`g-${m.id}`),
        }));
        const __VLS_10 = __VLS_9({
            index: (`g-${m.id}`),
        }, ...__VLS_functionalComponentArgsRest(__VLS_9));
        __VLS_11.slots.default;
        {
            const { title: __VLS_thisSlot } = __VLS_11.slots;
            (m.menuName);
        }
        for (const [c] of __VLS_getVForSourceType((m.children))) {
            const __VLS_12 = {}.ElMenuItem;
            /** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
            // @ts-ignore
            const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
                key: (c.id),
                index: (`/${c.path}`),
            }));
            const __VLS_14 = __VLS_13({
                key: (c.id),
                index: (`/${c.path}`),
            }, ...__VLS_functionalComponentArgsRest(__VLS_13));
            __VLS_15.slots.default;
            (c.menuName);
            var __VLS_15;
        }
        var __VLS_11;
    }
    else {
        const __VLS_16 = {}.ElMenuItem;
        /** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
        // @ts-ignore
        const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
            index: (`/${m.path}`),
        }));
        const __VLS_18 = __VLS_17({
            index: (`/${m.path}`),
        }, ...__VLS_functionalComponentArgsRest(__VLS_17));
        __VLS_19.slots.default;
        (m.menuName);
        var __VLS_19;
    }
}
var __VLS_3;
__VLS_asFunctionalElement(__VLS_intrinsicElements.main, __VLS_intrinsicElements.main)({
    ...{ class: "main" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.header, __VLS_intrinsicElements.header)({
    ...{ class: "header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
(__VLS_ctx.username);
const __VLS_20 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    ...{ 'onClick': {} },
    link: true,
}));
const __VLS_22 = __VLS_21({
    ...{ 'onClick': {} },
    link: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
let __VLS_24;
let __VLS_25;
let __VLS_26;
const __VLS_27 = {
    onClick: (__VLS_ctx.onLogout)
};
__VLS_23.slots.default;
var __VLS_23;
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "content" },
});
const __VLS_28 = {}.RouterView;
/** @type {[typeof __VLS_components.RouterView, typeof __VLS_components.routerView, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({}));
const __VLS_30 = __VLS_29({}, ...__VLS_functionalComponentArgsRest(__VLS_29));
/** @type {__VLS_StyleScopedClasses['layout']} */ ;
/** @type {__VLS_StyleScopedClasses['sidebar']} */ ;
/** @type {__VLS_StyleScopedClasses['logo']} */ ;
/** @type {__VLS_StyleScopedClasses['main']} */ ;
/** @type {__VLS_StyleScopedClasses['header']} */ ;
/** @type {__VLS_StyleScopedClasses['content']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            displayMenus: displayMenus,
            username: username,
            activePath: activePath,
            onLogout: onLogout,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
