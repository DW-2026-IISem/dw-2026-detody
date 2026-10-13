export function normalizePath(path: string): string {
  return path.split('?')[0].replace(/\/$/, '') || '/';
}

export function isOperationGranted(granted: any[], method: string, path: string): boolean {
  if (!Array.isArray(granted)) return false;
  return granted.some((g) => {
    const gMethod = (g.method || g.resource?.method || '').toUpperCase();
    const gPath = (g.path || g.resource?.path || '');
    if (gMethod !== '*' && gMethod !== method) return false;
    const pattern = gPath.replace(/:[^\s/]+/g, '[^/]+');
    const regex = new RegExp(`^${pattern}$`);
    return regex.test(path);
  });
}
