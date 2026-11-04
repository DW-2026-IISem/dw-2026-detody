import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
import { HttpMethod, Resource, ResourcePayload } from '../../../../core/models';
import { NotificationService } from '../../../../core/services/notification';
import { filterRows } from '../../../../core/utils/filter-rows';
import { methodSeverity } from '../../../../core/utils/http-method';
import { HasPermission } from '../../../../shared/directives/has-permission';
import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { StatusTag } from '../../../../shared/ui/status-tag/status-tag';
import { ResourceApi } from '../resource-api';
import { ResourceForm } from '../resource-form/resource-form';

@Component({
  selector: 'app-resource-list',
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
    ResourceForm,
  ],
  providers: [ConfirmationService],
  templateUrl: './resource-list.html',
  styleUrl: './resource-list.css',
})
export class ResourceList {
  private readonly resourceApi = inject(ResourceApi);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);

  readonly loading = signal(true);
  readonly rows = signal<Resource[]>([]);
  readonly filter = signal('');
  readonly methodFilter = signal<string>('');

  readonly formOpen = signal(false);
  readonly selectedResource = signal<Resource | null>(null);
  readonly saving = signal(false);

  readonly methods: { label: string; value: string }[] = [
    { label: 'Todos los métodos', value: '' },
    { label: 'GET', value: 'GET' },
    { label: 'POST', value: 'POST' },
    { label: 'PUT', value: 'PUT' },
    { label: 'PATCH', value: 'PATCH' },
    { label: 'DELETE', value: 'DELETE' },
  ];

  readonly countsByMethod = computed(() => {
    const counts = new Map<string, number>();
    for (const row of this.rows()) {
      const m = (row.method || row.http_method || row.httpMethod || 'GET').toUpperCase();
      counts.set(m, (counts.get(m) ?? 0) + 1);
    }
    return counts;
  });

  readonly visibleRows = computed(() => {
    const method = this.methodFilter();
    const filtered = filterRows(this.rows(), this.filter(), (row) => [
      row.path || row.route_path || row.routePath || '',
      row.description ?? '',
      row.method || row.http_method || row.httpMethod || '',
    ]);

    return method
      ? filtered.filter(
          (row) => (row.method || row.http_method || row.httpMethod || '').toUpperCase() === method,
        )
      : filtered;
  });

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.resourceApi.list().subscribe({
      next: (resources) => {
        this.rows.set(resources);
        this.loading.set(false);
      },
      error: () => {
        this.notify.error('Error', 'No fue posible cargar el catálogo de recursos');
        this.loading.set(false);
      },
    });
  }

  openCreate(): void {
    this.selectedResource.set(null);
    this.formOpen.set(true);
  }

  openEdit(resource: Resource): void {
    this.selectedResource.set(resource);
    this.formOpen.set(true);
  }

  save(payload: ResourcePayload): void {
    this.saving.set(true);
    const editing = this.selectedResource();

    const request$ = editing
      ? this.resourceApi.update(editing.id, payload)
      : this.resourceApi.create(payload);

    request$.subscribe({
      next: () => {
        this.notify.success(
          editing ? 'Recurso actualizado' : 'Recurso creado',
          `El recurso ${payload.method} ${payload.path} fue guardado correctamente`,
        );
        this.saving.set(false);
        this.formOpen.set(false);
        this.load();
      },
      error: () => {
        this.notify.error('Error', 'No fue posible guardar el recurso');
        this.saving.set(false);
      },
    });
  }

  confirmDeactivate(resource: Resource): void {
    const label = `${resource.method || 'OP'} ${resource.path}`;
    this.confirmation.confirm({
      header: 'Desactivar Recurso',
      message: `¿Estás seguro de desactivar el recurso ${label}?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Desactivar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => {
        this.resourceApi.deactivate(resource.id).subscribe({
          next: () => {
            this.notify.success('Desactivado', `Recurso ${label} desactivado`);
            this.load();
          },
          error: () => this.notify.error('Error', 'No se pudo desactivar el recurso'),
        });
      },
    });
  }

  confirmDelete(resource: Resource): void {
    const label = `${resource.method || 'OP'} ${resource.path}`;
    this.confirmation.confirm({
      header: 'Eliminar Recurso',
      message: `¿Eliminar permanentemente el recurso ${label}? Esto afectará a todas las concesiones asociadas.`,
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.resourceApi.remove(resource.id).subscribe({
          next: () => {
            this.notify.success('Eliminado', `Recurso ${label} eliminado`);
            this.load();
          },
          error: () => this.notify.error('Error', 'No se pudo eliminar el recurso'),
        });
      },
    });
  }

  methodSeverity(method: HttpMethod | string | undefined) {
    return methodSeverity(method);
  }
}
