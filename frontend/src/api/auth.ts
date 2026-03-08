import request from '@/utils/request';

export interface LoginForm {
  username: string;
  password: string;
}

export interface LoginResp {
  token: string;
  userId: number;
  username: string;
}

export function loginApi(data: LoginForm) {
  return request.post<any, LoginResp>('/api/auth/login', data);
}
