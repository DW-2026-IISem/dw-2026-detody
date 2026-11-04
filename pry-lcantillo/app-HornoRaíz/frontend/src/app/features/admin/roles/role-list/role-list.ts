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
import { Role, RolePayload } from '../../../../core/models';
import { NotificationService } from '../../../../core/services/notification';
import { filterRows } from '../../../../core/utils/filter-rows';
import { HasPermission } from '../../../../shared/directives/has-permission';
import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { StatusTag } from '../../../../shared/ui/status-tag/status-tag';
import { RoleApi } from '../role-api';
import { RoleForm } from '../role-form/role-form';

@Component({
  selector: 'app-role-list',
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
    RoleForm,
  ],
  providers: [ConfirmationService],
  templateUrl: './role-list.html',
  styleUrl: './role-list.css',
})
export class RoleList {
  private readonly roleApi = inject(RoleApi);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);

  readonly loading = signal(true);
  readonly rows = signal<Role[]>([]);
  readonly filter = signal('');

  readonly formOpen = signal(false);
  readonly selectedRole = signal<Role | null>(null);
  readonly saving = signal(false);

  readonly visibleRows = computed(() =>
    filterRows(this.rows(), this.filter(), (role) => [
      role.name,
      role.description ?? '',
      role.status ?? '',
    ]),
  );

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.roleApi.list().subscribe({
      next: (roles) => {
        this.rows.set(roles);
        this.loading.set(false);
      },
      error: () => {
        this.notify.error('Error', 'No fue posible cargar el catálogo de roles');
        this.loading.set(false);
      },
    });
  }

  openCreate(): void {
    this.selectedRole.set(null);
    this.formOpen.set(true);
  }

  openEdit(role: Role): void {
    this.selectedRole.set(role);
    this.formOpen.set(true);
  }

  save(payload: RolePayload): void {
    this.saving.set(true);
    const editing = this.selectedRole();

    const request$ = editing
      ? this.roleApi.update(editing.id, payload)
      : this.roleApi.create(payload);

    request$.subscribe({
      next: () => {
        this.notify.success(
          editing ? 'Rol actualizado' : 'Rol creado',
          `El rol ${payload.name} fue guardado correctamente`,
        );
        this.saving.set(false);
        this.formOpen.set(false);
        this.load();
      },
      error: () => {
        this.notify.error('Error', 'No fue posible guardar el rol');
        this.saving.set(false);
      },
    });
  }

  confirmDeactivate(role: Role): void {
    this.confirmation.confirm({
      header: 'Desactivar Rol',
      message: `¿Estás seguro de desactivar el rol ${role.name}?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Desactivar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => {
        this.roleApi.deactivate(role.id).subscribe({
          next: () => {
            this.notify.success('Desactivado', `Rol ${role.name} desactivado`);
            this.load();
          },
          error: () => this.notify.error('Error', 'No se pudo desactivar el rol'),
        });
      },
    });
  }

  confirmDelete(role: Role): void {
    this.confirmation.confirm({
      header: 'Eliminar Rol',
      message: `¿Eliminar permanentemente el rol ${role.name}?`,
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.roleApi.remove(role.id).subscribe({
          next: () => {
            this.notify.success('Eliminado', `Rol ${role.name} eliminado`);
            this.load();
          },
          error: () => this.notify.error('Error', 'No se pudo eliminar el rol'),
        });
      },
    });
  }
}
