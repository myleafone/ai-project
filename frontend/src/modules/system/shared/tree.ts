export interface TreeNode {
  id: number;
  parentId: number;
  sort?: number;
}

export function buildTree<T extends TreeNode>(items: T[]): (T & { children: T[] })[] {
  const map = new Map<number, T & { children: T[] }>();
  items.forEach((item) => map.set(item.id, { ...item, children: [] }));

  const roots: (T & { children: T[] })[] = [];
  map.forEach((node) => {
    if (node.parentId === 0) {
      roots.push(node);
      return;
    }
    const parent = map.get(node.parentId);
    if (parent) parent.children.push(node);
  });

  return roots.sort((a, b) => (a.sort || 0) - (b.sort || 0));
}
