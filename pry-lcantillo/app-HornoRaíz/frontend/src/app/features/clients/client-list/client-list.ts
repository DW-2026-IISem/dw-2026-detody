import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { StatusTag } from '../../../shared/ui/status-tag/status-tag';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [PageHeader, EmptyState, StatusTag, ButtonModule],
  template: `
    <app-page-header
      title="Gestión de Clientes"
      subtitle="Módulo de clientes mayoristas y minoristas de HornoRaíz"
    >
      <p-button
        label="Nuevo Cliente"
        icon="pi pi-plus"
        severity="contrast"
        size="small"
      />
    </app-page-header>

    <div class="mb-6 flex items-center gap-2">
      <span class="text-sm text-slate-500">Estado del módulo:</span>
      <app-status-tag status="active" />
    </div>

    <app-empty-state
      icon="pi pi-users"
      title="Núcleo ISS-02 Inicializado"
      message="Modelos, servicios HTTP y Shell layout configurados. El CRUD completo de clientes se conectará en ISS-03."
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientList {}
