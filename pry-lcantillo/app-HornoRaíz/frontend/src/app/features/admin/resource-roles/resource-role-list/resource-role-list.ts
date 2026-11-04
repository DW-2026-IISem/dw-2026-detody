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
import { Resource, ResourceRole, ResourceRolePayload, Role } from '../../../../core/models';
import { NotificationService } from '../../../../core/services/notification';
import { filterRows } from '../../../../core/utils/filter-rows';
import { methodSeverity } from '../../../../core/utils/http-method';
import { HasPermission } from '../../../../shared/directives/has-permission';
import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { StatusTag } from '../../../../shared/ui/status-tag/status-tag';
import { ResourceApi } from '../../resources/resource-api';
import { RoleApi } from '../../roles/role-api';
import { ResourceRoleApi } from '../resource-role-api';

@Component({
  selector: 'app-resource-role-list',
  standalone: true,
  imports: [
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
  templateUrl: './resource-role-list.html',
  styleUrl: './resource-role-list.css',
})
export class ResourceRoleList {
  private readonly resourceRoleApi = inject(ResourceRoleApi);
  private readonly roleApi = inject(RoleApi);
  private readonly resourceApi = inject(ResourceApi);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);

  readonly loading = signal(true);
  readonly rows = signal<ResourceRole[]>([]);
  readonly roles = signal<Role[]>([]);
  readonly resources = signal<Resource[]>([]);

  // Filtros
  readonly roleFilter = signal<Role | null>(null);
  readonly filter = signal('');

  // Diálogo Conceder
  readonly dialogOpen = signal(false);
  readonly selectedRole = signal<Role | null>(null);
  readonly selectedResource = signal<Resource | null>(null);
  readonly saving = signal(false);

  readonly canSave = computed(() => !!this.selectedRole() && !!this.selectedResource());

  readonly visibleRows = computed(() => {
    const role = this.roleFilter();
    const filtered = filterRows(this.rows(), this.filter(), (grant) => [
      grant.role?.name ?? '',
      grant.resource?.path || grant.resource?.route_path || grant.resource?.routePath || '',
      grant.resource?.method || grant.resource?.http_method || grant.resource?.httpMethod || '',
      grant.resource?.description ?? '',
    ]);

    return role
      ? filtered.filter((grant) => (grant.role_id ?? grant.roleId) === role.id)
      : filtered;
  });

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    forkJoin({
      grants: this.resourceRoleApi.list(),
      roles: this.roleApi.list(),
      resources: this.resourceApi.list(),
    }).subscribe({
      next: ({ grants, roles, resources }) => {
        this.rows.set(grants);
        this.roles.set(roles);
        this.resources.set(resources);
        this.loading.set(false);
      },
      error: () => {
        this.notify.error('Error', 'No fue posible cargar las concesiones rol-recurso');
        this.loading.set(false);
      },
    });
  }

  openGrant(): void {
    this.selectedRole.set(null);
    this.selectedResource.set(null);
    this.dialogOpen.set(true);
  }

  save(): void {
    const role = this.selectedRole();
    const resource = this.selectedResource();
    if (!role || !resource) return;

    this.saving.set(true);
    const payload: ResourceRolePayload = {
      role_id: role.id,
      resource_id: resource.id,
    };

    this.resourceRoleApi.create(payload).subscribe({
      next: () => {
        this.notify.success(
          'Permiso concedido',
          `Se concedió ${resource.method || 'OP'} ${resource.path} al rol ${role.name}`,
        );
        this.saving.set(false);
        this.dialogOpen.set(false);
        this.load();
      },
      error: () => {
        this.notify.error('Error', 'No fue posible conceder el permiso al rol');
        this.saving.set(false);
      },
    });
  }

  confirmRevoke(grant: ResourceRole): void {
    const roleName = grant.role?.name || `Rol #${grant.role_id}`;
    const resourcePath = grant.resource?.path || `Recurso #${grant.resource_id}`;

    this.confirmation.confirm({
      header: 'Revocar Permiso',
      message: `¿Revocar la concesión de ${resourcePath} para el rol ${roleName}?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Revocar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => {
        if (!grant.id) return;
        this.resourceRoleApi.deactivate(grant.id).subscribe({
          next: () => {
            this.notify.success('Permiso revocado', `Permiso revocado del rol ${roleName}`);
            this.load();
          },
          error: () => this.notify.error('Error', 'No fue posible revocar el permiso'),
        });
      },
    });
  }

  methodSeverity(method: string | undefined) {
    return methodSeverity(method);
  }
}
