import { Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { Status, User, UserPayload } from '../../../../core/models';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    MessageModule,
    PasswordModule,
    SelectModule,
  ],
  templateUrl: './user-form.html',
  styleUrl: './user-form.css',
})
export class UserForm {
  private readonly fb = inject(FormBuilder);

  readonly user = input<User | null>(null);
  readonly saving = input<boolean>(false);
  readonly saved = output<UserPayload>();
  readonly cancelled = output<void>();

  readonly statuses: { label: string; value: Status }[] = [
    { label: 'Activo', value: 'active' },
    { label: 'Inactivo', value: 'inactive' },
  ];

  readonly form = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    avatar: [''],
    status: ['active' as Status, [Validators.required]],
  });

  constructor() {
    effect(() => {
      const current = this.user();
      const passwordCtrl = this.form.controls.password;
      const statusCtrl = this.form.controls.status;

      if (current) {
        this.form.patchValue({
          username: current.username,
          email: current.email,
          avatar: current.avatar ?? '',
          status: current.status,
        });
        passwordCtrl.clearValidators();
        passwordCtrl.disable();
        statusCtrl.disable();
      } else {
        this.form.reset({
          username: '',
          email: '',
          password: '',
          avatar: '',
          status: 'active',
        });
        passwordCtrl.setValidators([Validators.required, Validators.minLength(8)]);
        passwordCtrl.enable();
        statusCtrl.enable();
      }
      passwordCtrl.updateValueAndValidity();
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const payload: UserPayload = {
      username: (value.username || '').trim(),
      email: (value.email || '').trim(),
      avatar: (value.avatar || '').trim() || null,
    };

    if (!this.user()) {
      payload.password = value.password || '';
      payload.status = value.status || 'active';
    }

    this.saved.emit(payload);
  }

  cancel(): void {
    this.cancelled.emit();
  }
}
