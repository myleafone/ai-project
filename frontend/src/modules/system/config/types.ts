export interface ConfigItem {
  id?: string;
  scopeId: string;
  configName: string;
  tags?: string;
  options: string;
  status: number;
  createTime?: string;
  updateTime?: string;
}

export interface PageResp<T> {
  records: T[];
  total: number;
  size: number;
  current: number;
}
