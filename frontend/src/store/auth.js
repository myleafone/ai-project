import { defineStore } from 'pinia';
import { loginApi } from '@/api/auth';
import { currentMenuApi } from '@/api/menu';
import { getToken, removeToken, setToken } from '@/utils/storage';
export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: getToken(),
        userId: 0,
        username: '',
        menus: []
    }),
    actions: {
        async login(form) {
            const res = await loginApi(form);
            this.token = res.token;
            this.userId = res.userId;
            this.username = res.username;
            setToken(res.token);
        },
        async fetchMenus() {
            this.menus = await currentMenuApi();
            return this.menus;
        },
        logout() {
            this.token = '';
            this.userId = 0;
            this.username = '';
            this.menus = [];
            removeToken();
        }
    }
});
