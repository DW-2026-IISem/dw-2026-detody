import { ChangeDetectionStrategy, Component, effect, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuItem, MessageService, ConfirmationService } from 'primeng/api';
import { DrawerModule } from 'primeng/drawer';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Header } from '../header/header';
import { Aside } from '../aside/aside';
import { Footer } from '../footer/footer';
import { watchMediaQuery } from '../../core/utils/media-query';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    RouterOutlet,
    DrawerModule,
    ToastModule,
    ConfirmDialogModule,
    Header,
    Aside,
    Footer,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './shell.html',
  styleUrl: './shell.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Shell {
  readonly isDesktop = watchMediaQuery('(min-width: 1024px)');
  readonly mobileOpen = signal(false);

  readonly items: MenuItem[] = [
    {
      label: 'Operación',
      icon: 'pi pi-compass',
      expanded: true,
      items: [
        {
          label: 'Clientes',
          icon: 'pi pi-users',
          routerLink: '/clientes',
        },
        {
          label: 'Tipos de Producto',
          icon: 'pi pi-tags',
          routerLink: '/tipos-producto',
        },
        {
          label: 'Productos',
          icon: 'pi pi-box',
          routerLink: '/productos',
        },
        {
          label: 'Ventas',
          icon: 'pi pi-shopping-cart',
          routerLink: '/ventas',
        },
        {
          label: 'Detalle de Ventas',
          icon: 'pi pi-list',
          routerLink: '/detalle-ventas',
        },
        {
          label: 'Dashboard',
          icon: 'pi pi-chart-bar',
          routerLink: '/dashboard',
        },
      ],
    },
    {
      label: 'Herramientas',
      icon: 'pi pi-wrench',
      expanded: true,
      items: [
        {
          label: 'Prototipo',
          icon: 'pi pi-desktop',
          routerLink: '/construir',
        },
        {
          label: 'Demo Signals',
          icon: 'pi pi-bolt',
          routerLink: '/demo',
        },
      ],
    },
  ];

  constructor() {
    effect(() => {
      if (this.isDesktop()) {
        this.mobileOpen.set(false);
      }
    });
  }

  onMenuToggle(): void {
    this.mobileOpen.update((open) => !open);
  }

  onNavigate(): void {
    if (!this.isDesktop()) {
      this.mobileOpen.set(false);
    }
  }
}
