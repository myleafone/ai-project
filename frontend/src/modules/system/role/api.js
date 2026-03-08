import request from '@/utils/request';
export function pageRoleApi(params) {
    return request.get('/api/roles', { params });
}
export function saveRoleApi(data) {
    return request.post('/api/roles', data);
}
export function deleteRoleApi(id) {
    return request.delete(`/api/roles/${id}`);
}
export function listRoleApi() {
    return request.get('/api/roles/all');
}
export function roleMenuIdsApi(id) {
    return request.get(`/api/roles/${id}/menu-ids`);
}
