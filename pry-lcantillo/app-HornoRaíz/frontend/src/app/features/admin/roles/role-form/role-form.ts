import { Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { Role, RolePayload, Status } from '../../../../core/models';

@Component({
  selector: 'app-role-form',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, InputTextModule, MessageModule, SelectModule],
  templateUrl: './role-form.html',
  styleUrl: './role-form.css',
})
export class RoleForm {
  private readonly fb = inject(FormBuilder);

  readonly role = input<Role | null>(null);
  readonly saving = input<boolean>(false);
  readonly saved = output<RolePayload>();
  readonly cancelled = output<void>();

  readonly statuses: { label: string; value: Status }[] = [
    { label: 'Activo', value: 'active' },
    { label: 'Inactivo', value: 'inactive' },
  ];

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(60)]],
    description: [''],
    status: ['active' as Status, [Validators.required]],
  });

  constructor() {
    effect(() => {
      const current = this.role();
      const statusCtrl = this.form.controls.status;

      if (current) {
        this.form.patchValue({
          name: current.name,
          description: current.description ?? '',
          status: current.status ?? 'active',
        });
        statusCtrl.disable();
      } else {
        this.form.reset({
          name: '',
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
    const payload: RolePayload = {
      name: (value.name || '').trim().toUpperCase(),
      description: (value.description || '').trim() || null,
    };

    if (!this.role()) {
      payload.status = value.status || 'active';
    }

    this.saved.emit(payload);
  }

  cancel(): void {
    this.cancelled.emit();
  }
}
