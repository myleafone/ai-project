import request from '@/utils/request';
import type { ConfigItem, PageResp } from './types';

export function pageConfigApi(params: { current: number; size: number; keyword?: string }) {
  return request.get<any, PageResp<ConfigItem>>('/api/configs', { params });
}

export function saveConfigApi(data: ConfigItem) {
  return request.post('/api/configs', data);
}

export function deleteConfigApi(id: string) {
  return request.delete(`/api/configs/${encodeURIComponent(id)}`);
}
