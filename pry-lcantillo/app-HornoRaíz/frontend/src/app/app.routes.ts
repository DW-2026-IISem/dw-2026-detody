import { Routes } from '@angular/router';

/**
 * Rutas de la aplicación.
 *
 * ISS-05 incorpora la ruta para el catálogo de productos (ProductList).
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
        redirectTo: 'clientes',
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
    ],
  },
  {
    path: '**',
    redirectTo: 'construir',
  },
];
