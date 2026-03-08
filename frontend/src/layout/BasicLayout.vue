<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="logo">Admin</div>
      <el-menu :default-active="activePath" router>
        <el-menu-item index="/dashboard">首页</el-menu-item>
        <template v-for="m in displayMenus" :key="m.id">
          <el-sub-menu v-if="m.children && m.children.length" :index="`g-${m.id}`">
            <template #title>{{ m.menuName }}</template>
            <el-menu-item v-for="c in m.children" :key="c.id" :index="`/${c.path}`">
              {{ c.menuName }}
            </el-menu-item>
          </el-sub-menu>
          <el-menu-item v-else :index="`/${m.path}`">{{ m.menuName }}</el-menu-item>
        </template>
      </el-menu>
    </aside>

    <main class="main">
      <header class="header">
        <span>{{ username }}</span>
        <el-button link @click="onLogout">退出</el-button>
      </header>
      <section class="content">
        <router-view />
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';
import type { MenuItem } from '@/api/menu';

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

const displayMenus = computed<MenuItem[]>(() => {
  const menus = JSON.parse(JSON.stringify(authStore.menus || [])) as MenuItem[];
  const configItem: MenuItem = {
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
</script>

<style scoped>
.layout { display: flex; min-height: 100vh; }
.sidebar { width: 220px; border-right: 1px solid #eee; background: #fff; }
.logo { height: 56px; display: flex; align-items: center; justify-content: center; font-weight: 700; }
.main { flex: 1; display: flex; flex-direction: column; background: #f5f7fa; }
.header { height: 56px; background: #fff; border-bottom: 1px solid #eee; display: flex; align-items: center; justify-content: flex-end; padding: 0 16px; gap: 8px; }
.content { padding: 16px; }
</style>
