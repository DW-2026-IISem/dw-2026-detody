import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';
import { AuthService } from '../../../core/services/auth';
import { SessionStore } from '../../../core/services/session-store';
import { NotificationService } from '../../../core/services/notification';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, TagModule, TableModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Profile {
  readonly session = inject(SessionStore);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notify = inject(NotificationService);

  readonly refreshing = signal<boolean>(false);

  refresh(): void {
    this.refreshing.set(true);
    this.auth.me().subscribe({
      next: () => {
        this.refreshing.set(false);
        this.notify.success('Sesión sincronizada', 'Perfil y permisos recargados con éxito.');
      },
      error: () => {
        this.refreshing.set(false);
        this.notify.error('Error', 'No se pudieron sincronizar los datos de sesión.');
      },
    });
  }

  logout(): void {
    this.auth.logout().subscribe({
      next: () => {
        this.notify.info('Sesión cerrada', 'Has salido del sistema de manera segura.');
        void this.router.navigate(['/login']);
      },
    });
  }
}
