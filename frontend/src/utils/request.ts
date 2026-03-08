import axios from 'axios';
import { ElMessage } from 'element-plus';
import router from '@/router';
import { getToken, removeToken } from '@/utils/storage';

const request = axios.create({
  baseURL: '/',
  timeout: 10000
});

request.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

request.interceptors.response.use(
  (response) => {
    const { code, message, data } = response.data;
    if (code !== 200) {
      ElMessage.error(message || '请求失败');
      return Promise.reject(new Error(message || '请求失败'));
    }
    return data;
  },
  (error) => {
    const msg = error?.response?.data?.message || error.message || '网络异常';
    if (error?.response?.status === 401 || msg.includes('Token')) {
      removeToken();
      router.replace('/login');
    }
    ElMessage.error(msg);
    return Promise.reject(error);
  }
);

export default request;
