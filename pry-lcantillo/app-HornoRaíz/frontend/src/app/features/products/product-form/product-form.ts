import { Component, effect, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { Status } from '../../../core/models/api.model';
import { Product, ProductPayload } from '../../../core/models/product.model';
import { ProductType } from '../../../core/models/product-type.model';

@Component({
  host: { class: 'block' },
  selector: 'app-product-form',
  imports: [
    ButtonModule,
    InputNumberModule,
    InputTextModule,
    MessageModule,
    ReactiveFormsModule,
    SelectModule,
  ],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css',
})
export class ProductForm {
  readonly key = input<number>(0);
  readonly product = input<Product | null>(null);
  readonly productTypes = input<ProductType[]>([]);
  readonly saving = input(false);
  readonly saved = output<ProductPayload>();
  readonly cancelled = output<void>();

  private readonly fb = inject(NonNullableFormBuilder);

  readonly statusOptions = [
    { label: 'Activo', value: 'active' },
    { label: 'Inactivo', value: 'inactive' },
  ];

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(120)]],
    brand: ['HornoRaíz', [Validators.required, Validators.maxLength(120)]],
    description: [''],
    price: [0, [Validators.required, Validators.min(0.01)]],
    min_stock: [5, [Validators.required, Validators.min(0)]],
    quantity: [0, [Validators.required, Validators.min(0)]],
    product_type_id: [null as number | null, [Validators.required]],
    status: ['active' as Status, [Validators.required]],
  });

  constructor() {
    effect(() => {
      const current = this.product();
      this.form.reset({
        name: current?.name ?? '',
        brand: current?.brand ?? 'HornoRaíz',
        description: current?.description ?? '',
        price: Number(current?.price ?? 0),
        min_stock: current?.min_stock ?? 5,
        quantity: current?.quantity ?? current?.stock ?? 0,
        product_type_id: current?.product_type_id ?? current?.productTypeId ?? null,
        status: current?.status ?? 'active',
      });

      // PATCH/PUT no aceptan status directamente: el estado cambia con /deactivate.
      if (current) {
        this.form.controls.status.disable();
      } else {
        this.form.controls.status.enable();
      }
    });
  }

  submit(): void {
    const value = this.form.getRawValue();
    if (this.form.invalid || value.product_type_id === null) {
      this.form.markAllAsTouched();
      return;
    }

    this.saved.emit({
      name: value.name.trim(),
      brand: value.brand.trim(),
      description: value.description?.trim() || null,
      price: Number(value.price),
      min_stock: Number(value.min_stock),
      quantity: Number(value.quantity),
      stock: Number(value.quantity),
      product_type_id: value.product_type_id,
      productTypeId: value.product_type_id,
      ...(this.product() ? {} : { status: value.status }),
    });
  }
}
