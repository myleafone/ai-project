export function buildTree(items) {
    const map = new Map();
    items.forEach((item) => map.set(item.id, { ...item, children: [] }));
    const roots = [];
    map.forEach((node) => {
        if (node.parentId === 0) {
            roots.push(node);
            return;
        }
        const parent = map.get(node.parentId);
        if (parent)
            parent.children.push(node);
    });
    return roots.sort((a, b) => (a.sort || 0) - (b.sort || 0));
}
