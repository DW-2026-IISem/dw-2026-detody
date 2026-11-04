import { Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { HttpMethod, Resource, ResourcePayload, Status } from '../../../../core/models';

@Component({
  selector: 'app-resource-form',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, InputTextModule, MessageModule, SelectModule],
  templateUrl: './resource-form.html',
  styleUrl: './resource-form.css',
})
export class ResourceForm {
  private readonly fb = inject(FormBuilder);

  readonly resource = input<Resource | null>(null);
  readonly saving = input<boolean>(false);
  readonly saved = output<ResourcePayload>();
  readonly cancelled = output<void>();

  readonly methods: { label: string; value: HttpMethod }[] = [
    { label: 'GET', value: 'GET' },
    { label: 'POST', value: 'POST' },
    { label: 'PUT', value: 'PUT' },
    { label: 'PATCH', value: 'PATCH' },
    { label: 'DELETE', value: 'DELETE' },
  ];

  readonly statuses: { label: string; value: Status }[] = [
    { label: 'Activo', value: 'active' },
    { label: 'Inactivo', value: 'inactive' },
  ];

  readonly form = this.fb.group({
    path: ['', [Validators.required, Validators.pattern(/^\/.*$/)]],
    method: ['GET' as HttpMethod, [Validators.required]],
    description: [''],
    status: ['active' as Status, [Validators.required]],
  });

  constructor() {
    effect(() => {
      const current = this.resource();
      const statusCtrl = this.form.controls.status;

      if (current) {
        this.form.patchValue({
          path: current.path || current.route_path || current.routePath || '',
          method: (current.method ||
            current.http_method ||
            current.httpMethod ||
            'GET') as HttpMethod,
          description: current.description ?? '',
          status: current.status ?? 'active',
        });
        statusCtrl.disable();
      } else {
        this.form.reset({
          path: '',
          method: 'GET',
          description: '',
          status: 'active',
        });
        statusCtrl.enable();
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const payload: ResourcePayload = {
      path: (value.path || '').trim(),
      method: value.method as HttpMethod,
      description: (value.description || '').trim() || null,
    };

    if (!this.resource()) {
      payload.status = value.status || 'active';
    }

    this.saved.emit(payload);
  }

  cancel(): void {
    this.cancelled.emit();
  }
}
