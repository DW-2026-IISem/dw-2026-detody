const ROUTE_ALIASES: Record<string, string> = {
  clientes: 'clients',
  'tipos-producto': 'product-types',
  ventas: 'sales',
  'detalle-ventas': 'product-sales',
  usuarios: 'users',
  recursos: 'resources',
  'asignaciones-rol': 'role-users',
  'concesiones-rol': 'resource-roles',
};

export function normalizeAliases(path: string): string {
  let normalized = path;
  for (const [es, en] of Object.entries(ROUTE_ALIASES)) {
    normalized = normalized.replace(new RegExp(`/api/${es}(/|$|:)`, 'g'), `/api/${en}$1`);
  }
  return normalized;
}

export function normalizePath(path: string): string {
  const clean = path.split('?')[0].replace(/\/$/, '') || '/';
  return normalizeAliases(clean);
}

export function isOperationGranted(granted: any[], method: string, path: string): boolean {
  if (!Array.isArray(granted)) return false;
  const targetPath = normalizeAliases(path);
  return granted.some((g) => {
    const gMethod = (g.method || g.resource?.method || '').toUpperCase();
    const gPath = normalizeAliases(g.path || g.resource?.path || '');
    if (gMethod !== '*' && gMethod !== method) return false;
    const pattern = gPath.replace(/:[^\s/]+/g, '[^/]+');
    const regex = new RegExp(`^${pattern}$`);
    return regex.test(targetPath);
  });
}
