<template>
  <el-card>
    <div class="toolbar">
      <el-button type="success" @click="openDialog()">新增菜单</el-button>
      <el-button @click="loadData">刷新</el-button>
    </div>

    <el-table :data="tableTree" border row-key="id" :tree-props="{ children: 'children' }" style="margin-top: 12px">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="menuName" label="菜单名称" />
      <el-table-column prop="path" label="路由路径" />
      <el-table-column prop="component" label="组件路径" />
      <el-table-column prop="menuType" label="类型" width="100">
        <template #default="scope">
          {{ typeLabel(scope.row.menuType) }}
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" width="80" />
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button link type="primary" @click="openDialog(scope.row)">编辑</el-button>
          <el-button link type="danger" @click="onDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="visible" :title="form.id ? '编辑菜单' : '新增菜单'" width="600px">
      <el-form :model="form" label-width="90px">
        <el-form-item label="上级菜单">
          <el-select v-model="form.parentId" style="width: 100%">
            <el-option :value="0" label="顶级菜单" />
            <el-option v-for="m in parentOptions" :key="m.id" :value="m.id" :label="m.menuName" />
          </el-select>
        </el-form-item>
        <el-form-item label="菜单名称"><el-input v-model="form.menuName" /></el-form-item>
        <el-form-item label="路由路径"><el-input v-model="form.path" /></el-form-item>
        <el-form-item label="组件路径"><el-input v-model="form.component" /></el-form-item>
        <el-form-item label="图标"><el-input v-model="form.icon" /></el-form-item>
        <el-form-item label="排序"><el-input-number v-model="form.sort" :min="0" /></el-form-item>
        <el-form-item label="类型">
          <el-radio-group v-model="form.menuType">
            <el-radio :value="1">目录</el-radio>
            <el-radio :value="2">菜单</el-radio>
            <el-radio :value="3">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="权限标识"><el-input v-model="form.perms" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { ElMessageBox } from 'element-plus';
import { deleteMenuApi, listMenuApi, saveMenuApi } from './api';
import type { MenuItem } from './types';
import { buildTree } from '@/modules/system/shared/tree';

const visible = ref(false);
const list = ref<MenuItem[]>([]);
const form = reactive<Partial<MenuItem>>({
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

function typeLabel(type: number) {
  return type === 1 ? '目录' : type === 2 ? '菜单' : '按钮';
}

async function loadData() {
  list.value = await listMenuApi();
}

function openDialog(row?: MenuItem) {
  if (row) {
    Object.assign(form, row);
  } else {
    Object.assign(form, { id: undefined, parentId: 0, menuName: '', path: '', component: '', icon: '', sort: 0, menuType: 2, perms: '' });
  }
  visible.value = true;
}

async function onSubmit() {
  await saveMenuApi(form);
  visible.value = false;
  await loadData();
}

async function onDelete(id: number) {
  await ElMessageBox.confirm('确认删除该菜单？', '提示', { type: 'warning' });
  await deleteMenuApi(id);
  await loadData();
}

loadData();
</script>

<style scoped>
.toolbar { display: flex; gap: 8px; }
</style>
