import { Routes } from '@angular/router';

/**
 * Rutas de la aplicación (Cierre de Fase I).
 *
 * ISS-07 incorpora las rutas finales de negocio:
 * - /dashboard: métricas globales y panel de control.
 * - /detalle-ventas: auditoría de líneas de venta.
 */
export const routes: Routes = [
  {
    path: 'construir',
    loadComponent: () =>
      import('./features/construir/construir').then((m) => m.Construir),
  },
  {
    path: '',
    loadComponent: () =>
      import('./layout/shell/shell').then((m) => m.Shell),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        title: 'Panel · HornoRaíz',
        loadComponent: () =>
          import('./features/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'clientes',
        title: 'Clientes · HornoRaíz',
        loadComponent: () =>
          import('./features/clients/client-list/client-list').then((m) => m.ClientList),
      },
      {
        path: 'tipos-producto',
        title: 'Tipos de producto · HornoRaíz',
        loadComponent: () =>
          import('./features/product-types/product-type-list/product-type-list').then(
            (m) => m.ProductTypeList,
          ),
      },
      {
        path: 'productos',
        title: 'Productos · HornoRaíz',
        loadComponent: () =>
          import('./features/products/product-list/product-list').then(
            (m) => m.ProductList,
          ),
      },
      {
        path: 'products',
        redirectTo: 'productos',
      },
      {
        path: 'ventas',
        title: 'Ventas · HornoRaíz',
        loadComponent: () =>
          import('./features/sales/sale-list/sale-list').then((m) => m.SaleList),
      },
      {
        path: 'ventas/nueva',
        title: 'Nueva venta · HornoRaíz',
        loadComponent: () =>
          import('./features/sales/sale-form/sale-form').then((m) => m.SaleForm),
      },
      {
        path: 'detalle-ventas',
        title: 'Detalle de ventas · HornoRaíz',
        loadComponent: () =>
          import('./features/product-sales/product-sale-list/product-sale-list').then(
            (m) => m.ProductSaleList,
          ),
      },
      {
        path: 'sales',
        redirectTo: 'ventas',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'construir',
  },
];
