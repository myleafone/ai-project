export interface MenuItem {
  id: number;
  parentId: number;
  menuName: string;
  path: string;
  component: string;
  icon?: string;
  menuType: number;
  sort: number;
  perms?: string;
  children?: MenuItem[];
}
