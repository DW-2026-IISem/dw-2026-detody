import { Component, effect, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { Status } from '../../../core/models/api.model';
import { Product } from '../../../core/models/product.model';
import { ProductSale, ProductSalePayload } from '../../../core/models/product-sale.model';
import { Sale } from '../../../core/models/sale.model';

@Component({
  host: { class: 'block' },
  selector: 'app-product-sale-form',
  imports: [
    ButtonModule,
    InputNumberModule,
    MessageModule,
    ReactiveFormsModule,
    SelectModule,
  ],
  templateUrl: './product-sale-form.html',
  styleUrl: './product-sale-form.css',
})
export class ProductSaleForm {
  readonly line = input<ProductSale | null>(null);
  readonly products = input<Product[]>([]);
  readonly sales = input<Sale[]>([]);
  readonly saving = input(false);
  readonly key = input<number>(0);

  readonly saved = output<ProductSalePayload>();
  readonly cancelled = output<void>();

  private readonly fb = inject(NonNullableFormBuilder);

  readonly form = this.fb.group({
    sale_id: [null as number | null, [Validators.required]],
    product_id: [null as number | null, [Validators.required]],
    quantity: [1, [Validators.required, Validators.min(1)]],
    status: ['active' as Status, [Validators.required]],
  });

  constructor() {
    effect(() => {
      const current = this.line();
      this.form.reset({
        sale_id: current?.sale_id ?? current?.saleId ?? null,
        product_id: current?.product_id ?? current?.productId ?? null,
        quantity: current?.quantity ?? 1,
        status: current?.status ?? 'active',
      });

      // En edición solo se permite alterar la cantidad.
      if (current) {
        this.form.controls.sale_id.disable();
        this.form.controls.product_id.disable();
        this.form.controls.status.disable();
      } else {
        this.form.controls.sale_id.enable();
        this.form.controls.product_id.enable();
        this.form.controls.status.enable();
      }
    });
  }

  submit(): void {
    const value = this.form.getRawValue();
    if (this.form.invalid || value.sale_id === null || value.product_id === null) {
      this.form.markAllAsTouched();
      return;
    }

    this.saved.emit({
      sale_id: value.sale_id,
      saleId: value.sale_id,
      product_id: value.product_id,
      productId: value.product_id,
      quantity: Number(value.quantity),
      ...(this.line() ? {} : { status: value.status }),
    });
  }
}
