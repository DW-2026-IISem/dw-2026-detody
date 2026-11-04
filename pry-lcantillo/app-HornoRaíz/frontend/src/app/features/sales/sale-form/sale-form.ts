import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { Client } from '../../../core/models/client.model';
import { Product } from '../../../core/models/product.model';
import { NotificationService } from '../../../core/services/notification';
import { HasPermission } from '../../../shared/directives/has-permission';
import { toApiMessage } from '../../../core/utils/api-error';
import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { ClientApi } from '../../clients/client-api';
import { ProductApi } from '../../products/product-api';
import { SaleApi } from '../sale-api';

export type DraftLine = { product_id: number; quantity: number };

/**
 * Formulario reactivo para registrar una venta atómica y transaccional con Signals.
 *
 * El frontend administra un borrador en memoria (líneas, cliente, subtotales).
 * Al confirmar, envía una única petición POST /api/ventas y el backend descuenta
 * el stock dentro de una transacción Sequelize.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-sale-form',
  imports: [
    HasPermission,
    CurrencyPipe,
    FormsModule,
    RouterLink,
    ButtonModule,
    CardModule,
    InputNumberModule,
    MessageModule,
    SelectModule,
    TableModule,
    TagModule,
    TooltipModule,
    EmptyState,
    PageHeader,
  ],
  templateUrl: './sale-form.html',
  styleUrl: './sale-form.css',
})
export class SaleForm {
  private readonly api = inject(SaleApi);
  private readonly clientsApi = inject(ClientApi);
  private readonly productsApi = inject(ProductApi);
  private readonly notify = inject(NotificationService);
  private readonly router = inject(Router);

  readonly clients = signal<Client[]>([]);
  readonly products = signal<Product[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  readonly clientId = signal<number | null>(null);
  readonly tax = signal(0);
  readonly discounts = signal(0);
  readonly lines = signal<DraftLine[]>([]);

  readonly selectedProductId = signal<number | null>(null);
  readonly quantity = signal(1);

  readonly productById = computed(() => {
    return new Map(this.products().map((product) => [product.id, product]));
  });

  readonly selectedProduct = computed(() => {
    const id = this.selectedProductId();
    return id === null ? null : (this.productById().get(id) ?? null);
  });

  /** Subtotal calculado desde el precio vigente de cada producto */
  readonly subtotal = computed(() =>
    this.lines().reduce((sum, line) => {
      const product = this.productById().get(line.product_id);
      return sum + Number(product?.price ?? 0) * line.quantity;
    }, 0),
  );

  /** Total final calculado con impuesto y descuento */
  readonly total = computed(
    () => this.subtotal() + Number(this.tax() ?? 0) - Number(this.discounts() ?? 0),
  );

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      clients: this.clientsApi.list(),
      products: this.productsApi.list(),
    }).subscribe({
      next: ({ clients, products }) => {
        this.clients.set(clients);
        this.products.set(products);
        this.loading.set(false);
      },
      error: (err: unknown) => {
        this.error.set(toApiMessage(err));
        this.loading.set(false);
      },
    });
  }

  addLine(): void {
    const productId = this.selectedProductId();
    const requested = Number(this.quantity());
    this.error.set(null);

    if (productId === null) {
      this.error.set('Selecciona un producto para agregar a la venta.');
      return;
    }

    if (!Number.isFinite(requested) || requested < 1) {
      this.error.set('La cantidad debe ser al menos 1.');
      return;
    }

    const product = this.productById().get(productId);
    if (!product) return;

    const availableStock = product.quantity ?? product.stock ?? 0;
    const already = this.lines()
      .filter((l) => l.product_id === productId)
      .reduce((sum, l) => sum + l.quantity, 0);

    if (already + requested > availableStock) {
      this.error.set(
        `Stock insuficiente de «${product.name}»: disponible ${availableStock}, solicitado ${already + requested}.`,
      );
      return;
    }

    this.lines.update((currentLines) => {
      const found = currentLines.find((l) => l.product_id === productId);
      if (!found) {
        return [...currentLines, { product_id: productId, quantity: requested }];
      }
      return currentLines.map((l) =>
        l.product_id === productId ? { ...l, quantity: l.quantity + requested } : l,
      );
    });

    this.selectedProductId.set(null);
    this.quantity.set(1);
  }

  removeLine(index: number): void {
    this.lines.update((current) => current.filter((_, i) => i !== index));
  }

  lineTotal(line: DraftLine): number {
    const product = this.productById().get(line.product_id);
    return Number(product?.price ?? 0) * line.quantity;
  }

  save(): void {
    const clientId = this.clientId();
    if (clientId === null) {
      this.error.set('Selecciona un cliente activo para la venta.');
      return;
    }

    if (this.lines().length === 0) {
      this.error.set('La venta requiere al menos un producto en el detalle.');
      return;
    }

    this.saving.set(true);
    this.error.set(null);

    this.api
      .create({
        client_id: clientId,
        clientId: clientId,
        tax: Number(this.tax() ?? 0),
        discounts: Number(this.discounts() ?? 0),
        items: this.lines(),
      })
      .subscribe({
        next: (sale) => {
          this.saving.set(false);
          this.notify.success(
            `Venta #${sale.id} registrada con éxito`,
            'Stock de productos e inventario actualizados.',
          );
          void this.router.navigate(['/ventas']);
        },
        error: (err: unknown) => {
          this.saving.set(false);
          const message = toApiMessage(err);
          this.error.set(message);
          this.notify.error('No se pudo registrar la venta', message);
        },
      });
  }
}
