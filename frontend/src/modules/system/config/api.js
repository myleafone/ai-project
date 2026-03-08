import request from '@/utils/request';
export function pageConfigApi(params) {
    return request.get('/api/configs', { params });
}
export function saveConfigApi(data) {
    return request.post('/api/configs', data);
}
export function deleteConfigApi(id) {
    return request.delete(`/api/configs/${encodeURIComponent(id)}`);
}
