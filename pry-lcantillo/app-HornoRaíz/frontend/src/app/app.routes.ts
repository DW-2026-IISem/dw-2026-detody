import { Routes } from '@angular/router';

/**
 * Rutas de la aplicación.
 *
 * ISS-02 introduce el layout Shell para las rutas del negocio y conserva
 * el prototipo en /construir.
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
    ],
  },
  {
    path: '**',
    redirectTo: 'construir',
  },
];
