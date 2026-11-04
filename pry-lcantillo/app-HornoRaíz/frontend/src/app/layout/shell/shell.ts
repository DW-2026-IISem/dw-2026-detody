import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MenuItem, MessageService, ConfirmationService } from 'primeng/api';
import { DrawerModule } from 'primeng/drawer';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Header } from '../header/header';
import { Aside } from '../aside/aside';
import { Footer } from '../footer/footer';
import { watchMediaQuery } from '../../core/utils/media-query';
import { SessionStore } from '../../core/services/session-store';
import { AuthService } from '../../core/services/auth';
import { NotificationService } from '../../core/services/notification';

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
  readonly session = inject(SessionStore);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notify = inject(NotificationService);

  readonly isDesktop = watchMediaQuery('(min-width: 1024px)');
  readonly mobileOpen = signal(false);

  readonly username = computed(() => this.session.user()?.username ?? 'Usuario');
  readonly initials = computed(() => {
    const name = this.username();
    return name ? name.slice(0, 2).toUpperCase() : 'HR';
  });
  readonly roleLabel = computed(() => this.session.roleNames().join(', ') || 'ADMIN');
  readonly permissionCount = computed(() => this.session.permissionCount());

  readonly userItems = computed<MenuItem[]>(() => [
    {
      label: 'Mi Perfil',
      icon: 'pi pi-user',
      routerLink: '/perfil',
    },
    {
      separator: true,
    },
    {
      label: 'Cerrar Sesión',
      icon: 'pi pi-sign-out',
      command: () => this.handleLogout(),
    },
  ]);

  readonly items: MenuItem[] = [
    {
      label: 'Principal',
      icon: 'pi pi-home',
      routerLink: '/dashboard',
    },
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
      ],
    },
    {
      label: 'Seguridad',
      icon: 'pi pi-shield',
      items: [
        {
          label: 'Mi Perfil',
          icon: 'pi pi-user',
          routerLink: '/perfil',
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

  handleLogout(): void {
    this.auth.logout().subscribe({
      next: () => {
        this.notify.info('Sesión cerrada', 'Has cerrado sesión exitosamente.');
        void this.router.navigate(['/login']);
      },
    });
  }
}
