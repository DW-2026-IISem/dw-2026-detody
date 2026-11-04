import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Tag } from 'primeng/tag';
import { Status } from '../../../core/models';

@Component({
  selector: 'app-status-tag',
  standalone: true,
  imports: [Tag],
  template: `
    <p-tag [value]="label()" [severity]="severity()" [rounded]="true" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusTag {
  readonly status = input<Status | string | undefined | null>();

  readonly label = computed(() => {
    const val = this.status();
    if (!val || val === 'active') return 'Activo';
    if (val === 'inactive') return 'Inactivo';
    if (val === 'completed') return 'Completada';
    if (val === 'cancelled') return 'Anulada';
    if (val === 'pending') return 'Pendiente';
    return String(val);
  });

  readonly severity = computed<'success' | 'danger' | 'info' | 'warn' | 'secondary'>(() => {
    const val = this.status();
    if (!val || val === 'active' || val === 'completed') return 'success';
    if (val === 'inactive' || val === 'cancelled') return 'danger';
    if (val === 'pending') return 'warn';
    return 'secondary';
  });
}
