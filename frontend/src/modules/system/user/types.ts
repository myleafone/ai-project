export interface UserItem {
  id?: number;
  username: string;
  password: string;
  nickname?: string;
  phone?: string;
  status: number;
  roleIds?: number[];
}

export interface PageResp<T> {
  records: T[];
  total: number;
  size: number;
  current: number;
}
