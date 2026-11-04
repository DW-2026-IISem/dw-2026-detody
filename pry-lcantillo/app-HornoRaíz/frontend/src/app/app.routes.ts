import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { guestGuard } from './core/guards/guest-guard';

export const routes: Routes = [
  // Ruta pública de demostración didáctica de ISS-01 / ISS-02
  {
    path: 'construir',
    loadComponent: () =>
      import('./features/construir/construir').then((m) => m.Construir),
  },
  // Pantalla de Login (protegida con guestGuard: si ya está autenticado redirige a /dashboard)
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
        loadComponent: () =>
          import('./features/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'perfil',
        title: 'Mi Perfil y Permisos · HornoRaíz',
        loadComponent: () =>
          import('./features/auth/profile/profile').then((m) => m.Profile),
      },
      {
        path: 'clientes',
        title: 'Gestión de Clientes · HornoRaíz',
        loadComponent: () =>
          import('./features/clients/client-list/client-list').then(
            (m) => m.ClientList,
          ),
      },
      {
        path: 'tipos-producto',
        title: 'Categorías de Panadería · HornoRaíz',
        loadComponent: () =>
          import('./features/product-types/product-type-list/product-type-list').then(
            (m) => m.ProductTypeList,
          ),
      },
      {
        path: 'productos',
        title: 'Catálogo de Panadería · HornoRaíz',
        loadComponent: () =>
          import('./features/products/product-list/product-list').then(
            (m) => m.ProductList,
          ),
      },
      {
        path: 'ventas',
        title: 'Historial de Ventas · HornoRaíz',
        loadComponent: () =>
          import('./features/sales/sale-list/sale-list').then((m) => m.SaleList),
      },
      {
        path: 'ventas/nueva',
        title: 'Registrar Nueva Venta · HornoRaíz',
        loadComponent: () =>
          import('./features/sales/sale-form/sale-form').then((m) => m.SaleForm),
      },
      {
        path: 'detalle-ventas',
        title: 'Detalle de Ventas · HornoRaíz',
        loadComponent: () =>
          import(
            './features/product-sales/product-sale-list/product-sale-list'
          ).then((m) => m.ProductSaleList),
      },
    ],
  },
  // Redirección por defecto
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
