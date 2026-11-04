import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { EffectivePermission, User, UserPayload } from '../../../../core/models';
import { NotificationService } from '../../../../core/services/notification';
import { SessionStore } from '../../../../core/services/session-store';
import { filterRows } from '../../../../core/utils/filter-rows';
import { methodSeverity } from '../../../../core/utils/http-method';
import { HasPermission } from '../../../../shared/directives/has-permission';
import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { StatusTag } from '../../../../shared/ui/status-tag/status-tag';
import { UserApi } from '../user-api';
import { UserForm } from '../user-form/user-form';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    DatePipe,
    FormsModule,
    ButtonModule,
    CardModule,
    ConfirmDialogModule,
    DialogModule,
    InputTextModule,
    SkeletonModule,
    TableModule,
    TagModule,
    TooltipModule,
    HasPermission,
    PageHeader,
    StatusTag,
    UserForm,
  ],
  providers: [ConfirmationService],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export class UserList {
  private readonly userApi = inject(UserApi);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);
  readonly session = inject(SessionStore);

  readonly loading = signal(true);
  readonly rows = signal<User[]>([]);
  readonly filter = signal('');

  readonly formOpen = signal(false);
  readonly selectedUser = signal<User | null>(null);
  readonly saving = signal(false);

  readonly accessOpen = signal(false);
  readonly accessLoading = signal(false);
  readonly accessUser = signal<User | null>(null);
  readonly access = signal<EffectivePermission[]>([]);

  readonly accessRoles = computed(() => {
    const byId = new Map<number, string>();
    for (const permission of this.access()) {
      byId.set(permission.role_id, permission.role_name);
    }
    return [...byId.entries()].map(([id, name]) => ({ id, name }));
  });

  readonly visibleRows = computed(() =>
    filterRows(this.rows(), this.filter(), (user) => [
      user.username,
      user.email,
      user.status,
    ]),
  );

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.userApi.list().subscribe({
      next: (users) => {
        this.rows.set(users);
        this.loading.set(false);
      },
      error: () => {
        this.notify.error('Error', 'No fue posible cargar el listado de usuarios');
        this.loading.set(false);
      },
    });
  }

  isSelf(user: User): boolean {
    return this.session.user()?.id === user.id;
  }

  openCreate(): void {
    this.selectedUser.set(null);
    this.formOpen.set(true);
  }

  openEdit(user: User): void {
    this.selectedUser.set(user);
    this.formOpen.set(true);
  }

  save(payload: UserPayload): void {
    this.saving.set(true);
    const editing = this.selectedUser();

    const request$ = editing
      ? this.userApi.update(editing.id, payload)
      : this.userApi.create(payload);

    request$.subscribe({
      next: () => {
        this.notify.success(
          editing ? 'Usuario actualizado' : 'Usuario creado',
          `El usuario ${payload.username} fue guardado correctamente`,
        );
        this.saving.set(false);
        this.formOpen.set(false);
        this.load();
      },
      error: () => {
        this.notify.error('Error', 'No fue posible guardar el usuario');
        this.saving.set(false);
      },
    });
  }

  confirmDeactivate(user: User): void {
    if (this.isSelf(user)) return;
    this.confirmation.confirm({
      header: 'Desactivar Usuario',
      message: `¿Estás seguro de desactivar la cuenta de ${user.username}?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Desactivar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => {
        this.userApi.deactivate(user.id).subscribe({
          next: () => {
            this.notify.success('Desactivado', `Usuario ${user.username} desactivado`);
            this.load();
          },
          error: () => this.notify.error('Error', 'No se pudo desactivar el usuario'),
        });
      },
    });
  }

  confirmDelete(user: User): void {
    if (this.isSelf(user)) return;
    this.confirmation.confirm({
      header: 'Eliminar Usuario',
      message: `¿Eliminar permanentemente al usuario ${user.username}? Esta acción no se puede deshacer.`,
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.userApi.remove(user.id).subscribe({
          next: () => {
            this.notify.success('Eliminado', `Usuario ${user.username} eliminado`);
            this.load();
          },
          error: () => this.notify.error('Error', 'No se pudo eliminar el usuario'),
        });
      },
    });
  }

  viewPermissions(user: User): void {
    this.accessUser.set(user);
    this.accessLoading.set(true);
    this.accessOpen.set(true);

    this.userApi.permissions(user.id).subscribe({
      next: (perms) => {
        this.access.set(perms);
        this.accessLoading.set(false);
      },
      error: () => {
        this.notify.error('Error', 'No fue posible obtener los permisos del usuario');
        this.accessLoading.set(false);
      },
    });
  }

  methodSeverity(method: string | undefined) {
    return methodSeverity(method);
  }
}
