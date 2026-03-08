export interface RoleItem {
  id?: number;
  roleCode: string;
  roleName: string;
  remark?: string;
  menuIds?: number[];
}

export interface PageResp<T> {
  records: T[];
  total: number;
  size: number;
  current: number;
}
