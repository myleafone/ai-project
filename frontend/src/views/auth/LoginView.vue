<template>
  <div class="login-wrap">
    <el-card class="login-card">
      <template #header><span>后台登录</span></template>
      <el-form :model="form" @submit.prevent>
        <el-form-item>
          <el-input v-model="form.username" placeholder="用户名" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="form.password" type="password" placeholder="密码" show-password />
        </el-form-item>
        <el-button type="primary" style="width:100%" @click="onLogin">登录</el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useAuthStore } from '@/store/auth';

const router = useRouter();
const authStore = useAuthStore();
const form = reactive({ username: 'admin', password: '123456' });

async function onLogin() {
  if (!form.username || !form.password) {
    ElMessage.warning('请输入用户名和密码');
    return;
  }
  await authStore.login(form);
  await authStore.fetchMenus();
  router.replace('/');
}
</script>

<style scoped>
.login-wrap {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f3f6ff 0%, #dfe9ff 100%);
}
.login-card { width: 360px; }
</style>
