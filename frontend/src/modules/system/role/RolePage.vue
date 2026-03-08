<template>
  <el-card>
    <div class="toolbar">
      <el-input v-model="query.keyword" placeholder="角色编码/角色名称" style="width: 280px" clearable />
      <el-button type="primary" @click="loadData">查询</el-button>
      <el-button type="success" @click="openDialog()">新增角色</el-button>
    </div>

    <el-table :data="tableData" style="margin-top: 12px" border>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="roleCode" label="角色编码" />
      <el-table-column prop="roleName" label="角色名称" />
      <el-table-column prop="remark" label="备注" />
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

    <el-dialog v-model="visible" :title="form.id ? '编辑角色' : '新增角色'" width="680px">
      <el-form :model="form" label-width="90px">
        <el-form-item label="角色编码"><el-input v-model="form.roleCode" /></el-form-item>
        <el-form-item label="角色名称"><el-input v-model="form.roleName" /></el-form-item>
        <el-form-item label="备注"><el-input v-model="form.remark" /></el-form-item>
        <el-form-item label="菜单权限">
          <el-tree
            ref="treeRef"
            style="width: 100%"
            show-checkbox
            node-key="id"
            :data="menuTree"
            :props="{ label: 'menuName', children: 'children' }"
            default-expand-all
          />
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
import { nextTick, reactive, ref } from 'vue';
import { ElMessageBox, type ElTree } from 'element-plus';
import { deleteRoleApi, pageRoleApi, roleMenuIdsApi, saveRoleApi } from './api';
import type { RoleItem } from './types';
import { listMenuApi } from '@/modules/system/menu/api';
import type { MenuItem } from '@/modules/system/menu/types';
import { buildTree } from '@/modules/system/shared/tree';

const query = reactive({ current: 1, size: 10, keyword: '' });
const total = ref(0);
const tableData = ref<RoleItem[]>([]);
const visible = ref(false);
const form = reactive<RoleItem>({ roleCode: '', roleName: '', remark: '', menuIds: [] });
const menuTree = ref<(MenuItem & { children: MenuItem[] })[]>([]);
const treeRef = ref<InstanceType<typeof ElTree>>();

async function loadMenus() {
  menuTree.value = buildTree(await listMenuApi());
}

async function loadData() {
  const data = await pageRoleApi(query);
  tableData.value = data.records;
  total.value = data.total;
}

function onPageChange(page: number) {
  query.current = page;
  loadData();
}

async function openDialog(row?: RoleItem) {
  treeRef.value?.setCheckedKeys([]);
  if (row?.id) {
    Object.assign(form, row);
    form.menuIds = await roleMenuIdsApi(row.id);
  } else {
    Object.assign(form, { id: undefined, roleCode: '', roleName: '', remark: '', menuIds: [] });
  }
  visible.value = true;
  await nextTick();
  treeRef.value?.setCheckedKeys(form.menuIds || []);
}

async function onSubmit() {
  const checkedKeys = treeRef.value?.getCheckedKeys(false) || [];
  const halfCheckedKeys = treeRef.value?.getHalfCheckedKeys() || [];
  form.menuIds = [...new Set([...(checkedKeys as number[]), ...(halfCheckedKeys as number[])])];
  await saveRoleApi(form as RoleItem);
  visible.value = false;
  await loadData();
}

async function onDelete(id: number) {
  await ElMessageBox.confirm('确认删除该角色？', '提示', { type: 'warning' });
  await deleteRoleApi(id);
  await loadData();
}

(async () => {
  await loadMenus();
  await loadData();
})();
</script>

<style scoped>
.toolbar { display: flex; gap: 8px; }
</style>
