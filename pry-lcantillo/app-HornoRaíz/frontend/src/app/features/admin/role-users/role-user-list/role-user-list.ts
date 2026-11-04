import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { Role, RoleUser, RoleUserPayload, User } from '../../../../core/models';
import { NotificationService } from '../../../../core/services/notification';
import { HasPermission } from '../../../../shared/directives/has-permission';
import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { StatusTag } from '../../../../shared/ui/status-tag/status-tag';
import { RoleApi } from '../../roles/role-api';
import { UserApi } from '../../users/user-api';
import { RoleUserApi } from '../role-user-api';

@Component({
  selector: 'app-role-user-list',
  standalone: true,
  imports: [
    DatePipe,
    FormsModule,
    ButtonModule,
    CardModule,
    ConfirmDialogModule,
    DialogModule,
    InputTextModule,
    SelectModule,
    SkeletonModule,
    TableModule,
    TagModule,
    TooltipModule,
    HasPermission,
    PageHeader,
    StatusTag,
  ],
  providers: [ConfirmationService],
  templateUrl: './role-user-list.html',
  styleUrl: './role-user-list.css',
})
export class RoleUserList {
  private readonly roleUserApi = inject(RoleUserApi);
  private readonly userApi = inject(UserApi);
  private readonly roleApi = inject(RoleApi);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);

  readonly loading = signal(true);
  readonly rows = signal<RoleUser[]>([]);
  readonly users = signal<User[]>([]);
  readonly roles = signal<Role[]>([]);

  // Filtros
  readonly userFilter = signal<User | null>(null);
  readonly roleFilter = signal<Role | null>(null);

  // Diálogo Asignar
  readonly dialogOpen = signal(false);
  readonly selectedUser = signal<User | null>(null);
  readonly selectedRole = signal<Role | null>(null);
  readonly saving = signal(false);

  readonly canSave = computed(() => !!this.selectedUser() && !!this.selectedRole());

  readonly visibleRows = computed(() => {
    const user = this.userFilter();
    const role = this.roleFilter();

    return this.rows().filter(
      (row) =>
        (!user || (row.user_id ?? row.userId) === user.id) &&
        (!role || (row.role_id ?? row.roleId) === role.id),
    );
  });

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    forkJoin({
      assignments: this.roleUserApi.list(),
      users: this.userApi.list(),
      roles: this.roleApi.list(),
    }).subscribe({
      next: ({ assignments, users, roles }) => {
        this.rows.set(assignments);
        this.users.set(users);
        this.roles.set(roles);
        this.loading.set(false);
      },
      error: () => {
        this.notify.error('Error', 'No fue posible cargar las asignaciones usuario-rol');
        this.loading.set(false);
      },
    });
  }

  openAssign(): void {
    this.selectedUser.set(null);
    this.selectedRole.set(null);
    this.dialogOpen.set(true);
  }

  save(): void {
    const user = this.selectedUser();
    const role = this.selectedRole();
    if (!user || !role) return;

    this.saving.set(true);
    const payload: RoleUserPayload = {
      user_id: user.id,
      role_id: role.id,
    };

    this.roleUserApi.create(payload).subscribe({
      next: () => {
        this.notify.success(
          'Rol asignado',
          `Se asignó el rol ${role.name} al usuario ${user.username}`,
        );
        this.saving.set(false);
        this.dialogOpen.set(false);
        this.load();
      },
      error: () => {
        this.notify.error('Error', 'No fue posible asignar el rol al usuario');
        this.saving.set(false);
      },
    });
  }

  confirmRevoke(assignment: RoleUser): void {
    const username = assignment.user?.username || `Usuario #${assignment.user_id}`;
    const roleName = assignment.role?.name || `Rol #${assignment.role_id}`;

    this.confirmation.confirm({
      header: 'Retirar Rol',
      message: `¿Retirar el rol ${roleName} del usuario ${username}?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Retirar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => {
        if (!assignment.id) return;
        this.roleUserApi.deactivate(assignment.id).subscribe({
          next: () => {
            this.notify.success('Rol retirado', `Se retiró el rol ${roleName} de ${username}`);
            this.load();
          },
          error: () => this.notify.error('Error', 'No fue posible retirar el rol'),
        });
      },
    });
  }
}
