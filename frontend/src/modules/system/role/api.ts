import request from '@/utils/request';
import type { RoleItem, PageResp } from './types';

export function pageRoleApi(params: { current: number; size: number; keyword?: string }) {
  return request.get<any, PageResp<RoleItem>>('/api/roles', { params });
}

export function saveRoleApi(data: RoleItem) {
  return request.post('/api/roles', data);
}

export function deleteRoleApi(id: number) {
  return request.delete(`/api/roles/${id}`);
}

export function listRoleApi() {
  return request.get<any, RoleItem[]>('/api/roles/all');
}

export function roleMenuIdsApi(id: number) {
  return request.get<any, number[]>(`/api/roles/${id}/menu-ids`);
}
