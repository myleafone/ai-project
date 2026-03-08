import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/store/auth';
import { getToken } from '@/utils/storage';
import type { MenuItem } from '@/api/menu';

const viewModules = import.meta.glob('/src/views/**/*.vue');

const routes: RouteRecordRaw[] = [
  { path: '/login', component: () => import('@/views/auth/LoginView.vue') },
  {
    path: '/',
    name: 'Root',
    component: () => import('@/layout/BasicLayout.vue'),
    redirect: '/dashboard',
    children: [
      { path: 'dashboard', name: 'Dashboard', component: () => import('@/views/system/DashboardView.vue') },
      { path: 'system/config', name: 'SystemConfig', component: () => import('@/views/system/ConfigView.vue') }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

let dynamicLoaded = false;

function mapMenuToRoute(menu: MenuItem): RouteRecordRaw | null {
  if (!menu.path || !menu.component) return null;
  const key = `/src/views/${menu.component}.vue`;
  const component = viewModules[key];
  if (!component) return null;

  return {
    path: menu.path.replace(/^\//, ''),
    name: `menu-${menu.id}`,
    component,
    meta: { title: menu.menuName }
  };
}

async function ensureDynamicRoutes() {
  if (dynamicLoaded) return;
  const store = useAuthStore();
  const menus = await store.fetchMenus();

  for (const root of menus) {
    const group = [root, ...(root.children || [])];
    for (const item of group) {
      const route = mapMenuToRoute(item);
      if (route && !router.hasRoute(String(route.name))) {
        router.addRoute('Root', route);
      }
    }
  }
  dynamicLoaded = true;
}

router.beforeEach(async (to) => {
  const token = getToken();
  if (to.path !== '/login' && !token) return '/login';
  if (to.path === '/login' && token) return '/';
  if (token) await ensureDynamicRoutes();
  return true;
});

export default router;
