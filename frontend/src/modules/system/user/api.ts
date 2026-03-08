import request from '@/utils/request';
import type { UserItem, PageResp } from './types';

export function pageUserApi(params: { current: number; size: number; keyword?: string }) {
  return request.get<any, PageResp<UserItem>>('/api/users', { params });
}

export function saveUserApi(data: UserItem) {
  return request.post('/api/users', data);
}

export function deleteUserApi(id: number) {
  return request.delete(`/api/users/${id}`);
}

export function userRoleIdsApi(id: number) {
  return request.get<any, number[]>(`/api/users/${id}/role-ids`);
}
