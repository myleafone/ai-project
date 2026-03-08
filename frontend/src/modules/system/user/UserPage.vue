<template>
  <el-card>
    <div class="toolbar">
      <el-input v-model="query.keyword" placeholder="用户名/昵称/手机号" style="width: 280px" clearable />
      <el-button type="primary" @click="loadData">查询</el-button>
      <el-button type="success" @click="openDialog()">新增用户</el-button>
    </div>

    <el-table :data="tableData" style="margin-top: 12px" border>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="nickname" label="昵称" />
      <el-table-column prop="phone" label="手机号" />
      <el-table-column label="角色">
        <template #default="scope">
          {{ roleNames(scope.row.roleIds || []) }}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">{{ scope.row.status === 1 ? '启用' : '禁用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
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

    <el-dialog v-model="visible" :title="form.id ? '编辑用户' : '新增用户'" width="520px">
      <el-form :model="form" label-width="90px">
        <el-form-item label="用户名"><el-input v-model="form.username" /></el-form-item>
        <el-form-item label="密码"><el-input v-model="form.password" type="password" show-password /></el-form-item>
        <el-form-item label="昵称"><el-input v-model="form.nickname" /></el-form-item>
        <el-form-item label="手机号"><el-input v-model="form.phone" /></el-form-item>
        <el-form-item label="角色">
          <el-select v-model="form.roleIds" multiple style="width: 100%" placeholder="请选择角色">
            <el-option v-for="r in roleOptions" :key="r.id" :label="r.roleName" :value="r.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :value="1">启用</el-radio>
            <el-radio :value="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { ElMessageBox } from 'element-plus';
import { deleteUserApi, pageUserApi, saveUserApi, userRoleIdsApi } from './api';
import type { UserItem } from './types';
import { listRoleApi } from '@/modules/system/role/api';
import type { RoleItem } from '@/modules/system/role/types';

const query = reactive({ current: 1, size: 10, keyword: '' });
const total = ref(0);
const tableData = ref<UserItem[]>([]);
const visible = ref(false);
const roleOptions = ref<RoleItem[]>([]);
const form = reactive<UserItem>({ username: '', password: '', nickname: '', phone: '', status: 1, roleIds: [] });

async function loadRoleOptions() {
  roleOptions.value = await listRoleApi();
}

function roleNames(roleIds: number[]) {
  return roleOptions.value.filter((r) => roleIds.includes(r.id || 0)).map((r) => r.roleName).join('、') || '-';
}

async function loadData() {
  const data = await pageUserApi(query);
  const records = await Promise.all(
    data.records.map(async (item) => ({
      ...item,
      roleIds: item.id ? await userRoleIdsApi(item.id) : []
    }))
  );
  tableData.value = records;
  total.value = data.total;
}

function onPageChange(page: number) {
  query.current = page;
  loadData();
}

async function openDialog(row?: UserItem) {
  if (row) {
    const roleIds = row.id ? await userRoleIdsApi(row.id) : [];
    Object.assign(form, row, { roleIds, password: row.password || '123456' });
  } else {
    Object.assign(form, { id: undefined, username: '', password: '', nickname: '', phone: '', status: 1, roleIds: [] });
  }
  visible.value = true;
}

async function onSubmit() {
  await saveUserApi(form);
  visible.value = false;
  await loadData();
}

async function onDelete(id: number) {
  await ElMessageBox.confirm('确认删除该用户？', '提示', { type: 'warning' });
  await deleteUserApi(id);
  await loadData();
}

(async () => {
  await loadRoleOptions();
  await loadData();
})();
</script>

<style scoped>
.toolbar { display: flex; gap: 8px; }
</style>
