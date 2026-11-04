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
import { NAV } from './nav.config';

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

  /** Menú lateral filtrado reactivamente por permisos y estado de auth */
  readonly items = computed<MenuItem[]>(() => this.navGroups());
  readonly navGroups = computed<MenuItem[]>(() =>
    NAV.filter((group) => !group.authOnly || this.session.authEnabled)
      .map((group) => ({
        label: group.label,
        expanded: true,
        items: group.items
          .filter((item) => !item.permission || this.session.canPermission(item.permission))
          .map<MenuItem>((item) => ({
            label: item.label,
            icon: item.icon,
            routerLink: item.routerLink,
            routerLinkActiveOptions: { exact: item.routerLink === '/ventas' },
          })),
      }))
      .filter((group) => (group.items?.length ?? 0) > 0),
  );

  readonly userItems = computed<MenuItem[]>(() => [
    {
      label: 'Mi Perfil',
      icon: 'pi pi-user',
      routerLink: '/perfil',
    },
    {
      label: 'Actualizar permisos',
      icon: 'pi pi-refresh',
      command: () => this.handleRefreshPermissions(),
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

  handleRefreshPermissions(): void {
    this.auth.me().subscribe({
      next: () => {
        this.notify.success('Permisos actualizados', 'La matriz de permisos y el menú se han refrescado.');
      },
      error: () => {
        this.notify.error('Error', 'No se pudieron actualizar los permisos.');
      },
    });
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
