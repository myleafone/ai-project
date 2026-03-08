import request from '@/utils/request';
export function pageUserApi(params) {
    return request.get('/api/users', { params });
}
export function saveUserApi(data) {
    return request.post('/api/users', data);
}
export function deleteUserApi(id) {
    return request.delete(`/api/users/${id}`);
}
export function userRoleIdsApi(id) {
    return request.get(`/api/users/${id}/role-ids`);
}
