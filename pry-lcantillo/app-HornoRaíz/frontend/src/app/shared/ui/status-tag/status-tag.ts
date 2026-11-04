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
  readonly status = input.required<Status | string>();

  readonly label = computed(() => {
    const val = this.status();
    if (val === 'active') return 'Activo';
    if (val === 'inactive') return 'Inactivo';
    return String(val);
  });

  readonly severity = computed<'success' | 'danger' | 'info' | 'warn' | 'secondary'>(() => {
    const val = this.status();
    if (val === 'active') return 'success';
    if (val === 'inactive') return 'danger';
    return 'secondary';
  });
}
