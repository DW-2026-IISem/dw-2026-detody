import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { guestGuard } from './core/guards/guest-guard';
import { permissionGuard } from './core/guards/permission-guard';
import { authOnlyGuard } from './core/guards/auth-only-guard';

export const routes: Routes = [
  // Ruta pública de demostración didáctica de ISS-01 / ISS-02
  {
    path: 'construir',
    loadComponent: () =>
      import('./features/construir/construir').then((m) => m.Construir),
  },
  // Pantalla de Login (guestGuard: si ya está autenticado redirige a /dashboard)
  {
    path: 'login',
    title: 'Iniciar Sesión · HornoRaíz',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/login/login').then((m) => m.Login),
  },
  // Pantalla de Acceso Prohibido (403)
  {
    path: 'forbidden',
    title: 'Acceso Denegado · HornoRaíz',
    loadComponent: () =>
      import('./features/auth/forbidden/forbidden').then((m) => m.Forbidden),
  },
  // Rutas internas protegidas dentro del Shell con authGuard
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/shell/shell').then((m) => m.Shell),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        title: 'Panel de Control · HornoRaíz',
        canActivate: [permissionGuard],
        data: { permission: 'GET /api/ventas' },
        loadComponent: () =>
          import('./features/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'perfil',
        title: 'Mi Perfil y Permisos · HornoRaíz',
        canActivate: [authOnlyGuard],
        loadComponent: () =>
          import('./features/auth/profile/profile').then((m) => m.Profile),
      },
      {
        path: 'clientes',
        title: 'Gestión de Clientes · HornoRaíz',
        canActivate: [permissionGuard],
        data: { permission: 'GET /api/clientes' },
        loadComponent: () =>
          import('./features/clients/client-list/client-list').then(
            (m) => m.ClientList,
          ),
      },
      {
        path: 'tipos-producto',
        title: 'Categorías de Panadería · HornoRaíz',
        canActivate: [permissionGuard],
        data: { permission: 'GET /api/tipos-producto' },
        loadComponent: () =>
          import('./features/product-types/product-type-list/product-type-list').then(
            (m) => m.ProductTypeList,
          ),
      },
      {
        path: 'productos',
        title: 'Catálogo de Panadería · HornoRaíz',
        canActivate: [permissionGuard],
        data: { permission: 'GET /api/productos' },
        loadComponent: () =>
          import('./features/products/product-list/product-list').then(
            (m) => m.ProductList,
          ),
      },
      {
        path: 'ventas',
        title: 'Historial de Ventas · HornoRaíz',
        canActivate: [permissionGuard],
        data: { permission: 'GET /api/ventas' },
        loadComponent: () =>
          import('./features/sales/sale-list/sale-list').then((m) => m.SaleList),
      },
      {
        path: 'ventas/nueva',
        title: 'Registrar Nueva Venta · HornoRaíz',
        canActivate: [permissionGuard],
        data: { permission: 'POST /api/ventas' },
        loadComponent: () =>
          import('./features/sales/sale-form/sale-form').then((m) => m.SaleForm),
      },
      {
        path: 'detalle-ventas',
        title: 'Detalle de Ventas · HornoRaíz',
        canActivate: [permissionGuard],
        data: { permission: 'GET /api/detalle-ventas' },
        loadComponent: () =>
          import(
            './features/product-sales/product-sale-list/product-sale-list'
          ).then((m) => m.ProductSaleList),
      },
      // ========================================================================
      // FASE II - ISS-10: Administración RBAC
      // ========================================================================
      {
        path: 'admin/usuarios',
        title: 'Usuarios · HornoRaíz',
        canActivate: [permissionGuard],
        data: { permission: 'GET /api/usuarios' },
        loadComponent: () =>
          import('./features/admin/users/user-list/user-list').then((m) => m.UserList),
      },
      {
        path: 'admin/roles',
        title: 'Roles · HornoRaíz',
        canActivate: [permissionGuard],
        data: { permission: 'GET /api/roles' },
        loadComponent: () =>
          import('./features/admin/roles/role-list/role-list').then((m) => m.RoleList),
      },
      {
        path: 'admin/recursos',
        title: 'Recursos · HornoRaíz',
        canActivate: [permissionGuard],
        data: { permission: 'GET /api/recursos' },
        loadComponent: () =>
          import('./features/admin/resources/resource-list/resource-list').then(
            (m) => m.ResourceList,
          ),
      },
      {
        path: 'admin/asignaciones',
        title: 'Asignaciones · HornoRaíz',
        canActivate: [permissionGuard],
        data: { permission: 'GET /api/asignaciones-rol' },
        loadComponent: () =>
          import(
            './features/admin/role-users/role-user-list/role-user-list'
          ).then((m) => m.RoleUserList),
      },
      {
        path: 'admin/permisos',
        title: 'Concesiones · HornoRaíz',
        canActivate: [permissionGuard],
        data: { permission: 'GET /api/concesiones-rol' },
        loadComponent: () =>
          import(
            './features/admin/resource-roles/resource-role-list/resource-role-list'
          ).then((m) => m.ResourceRoleList),
      },
    ],
  },
  // Redirección por defecto
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
