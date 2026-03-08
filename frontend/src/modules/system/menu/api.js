import request from '@/utils/request';
export function currentMenuApi() {
    return request.get('/api/menus/current');
}
export function listMenuApi() {
    return request.get('/api/menus');
}
export function saveMenuApi(data) {
    return request.post('/api/menus', data);
}
export function deleteMenuApi(id) {
    return request.delete(`/api/menus/${id}`);
}
