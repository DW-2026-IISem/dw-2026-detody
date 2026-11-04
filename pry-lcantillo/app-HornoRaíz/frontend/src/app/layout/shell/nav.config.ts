export interface NavItem {
  label: string;
  icon?: string;
  routerLink: string;
  permission?: string;
}

export interface NavGroup {
  label: string;
  authOnly?: boolean;
  items: NavItem[];
}

export const NAV: NavGroup[] = [
  {
    label: 'Principal',
    items: [
      {
        label: 'Panel de Control',
        icon: 'pi pi-home',
        routerLink: '/dashboard',
        permission: 'GET /api/ventas',
      },
    ],
  },
  {
    label: 'Operación',
    items: [
      {
        label: 'Clientes',
        icon: 'pi pi-users',
        routerLink: '/clientes',
        permission: 'GET /api/clientes',
      },
      {
        label: 'Tipos de Producto',
        icon: 'pi pi-tags',
        routerLink: '/tipos-producto',
        permission: 'GET /api/tipos-producto',
      },
      {
        label: 'Productos',
        icon: 'pi pi-box',
        routerLink: '/productos',
        permission: 'GET /api/productos',
      },
      {
        label: 'Ventas',
        icon: 'pi pi-shopping-cart',
        routerLink: '/ventas',
        permission: 'GET /api/ventas',
      },
      {
        label: 'Detalle de Ventas',
        icon: 'pi pi-list',
        routerLink: '/detalle-ventas',
        permission: 'GET /api/detalle-ventas',
      },
    ],
  },
  {
    label: 'Seguridad',
    authOnly: true,
    items: [
      {
        label: 'Mi Perfil',
        icon: 'pi pi-user',
        routerLink: '/perfil',
      },
    ],
  },
];
