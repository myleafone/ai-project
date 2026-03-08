import request from '@/utils/request';
import type { MenuItem } from './types';

export function currentMenuApi() {
  return request.get<any, MenuItem[]>('/api/menus/current');
}

export function listMenuApi() {
  return request.get<any, MenuItem[]>('/api/menus');
}

export function saveMenuApi(data: Partial<MenuItem>) {
  return request.post('/api/menus', data);
}

export function deleteMenuApi(id: number) {
  return request.delete(`/api/menus/${id}`);
}
