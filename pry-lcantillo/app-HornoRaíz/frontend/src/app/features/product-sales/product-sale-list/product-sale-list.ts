import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { Product } from '../../../core/models/product.model';
import { ProductSale, ProductSalePayload } from '../../../core/models/product-sale.model';
import { Sale } from '../../../core/models/sale.model';
import { NotificationService } from '../../../core/services/notification';
import { toApiMessage } from '../../../core/utils/api-error';
import { filterRows } from '../../../core/utils/filter-rows';
import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { StatusTag } from '../../../shared/ui/status-tag/status-tag';
import { ProductApi } from '../../products/product-api';
import { SaleApi } from '../../sales/sale-api';
import { ProductSaleApi } from '../product-sale-api';
import { ProductSaleForm } from '../product-sale-form/product-sale-form';
import { HasPermission } from '../../../shared/directives/has-permission';

/**
 * Listado independiente de líneas de venta (/api/detalle-ventas).
 * Permite auditar cada ítem vendido, su precio unitario capturado y el subtotal.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-product-sale-list',
  imports: [
    HasPermission,
    CurrencyPipe,
    ButtonModule,
    DialogModule,
    EmptyState,
    InputTextModule,
    MessageModule,
    PageHeader,
    StatusTag,
    TableModule,
    TagModule,
    TooltipModule,
    ProductSaleForm,
  ],
  templateUrl: './product-sale-list.html',
  styleUrl: './product-sale-list.css',
})
export class ProductSaleList {
  private readonly api = inject(ProductSaleApi);
  private readonly productsApi = inject(ProductApi);
  private readonly salesApi = inject(SaleApi);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);

  readonly rows = signal<ProductSale[]>([]);
  readonly products = signal<Product[]>([]);
  readonly sales = signal<Sale[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly filter = signal('');

  readonly dialogVisible = signal(false);
  readonly editing = signal<ProductSale | null>(null);
  readonly resetKey = signal(0);
  readonly title = computed(() => (this.editing() ? 'Editar línea de venta' : 'Nueva línea'));

  readonly productName = computed(() => {
    const map = new Map(this.products().map((product) => [product.id, product.name]));
    return (id: number) => map.get(id) ?? `Producto #${id}`;
  });

  readonly visibleRows = computed(() =>
    filterRows(this.rows(), this.filter(), (line) => [
      String(line.id),
      String(line.sale_id ?? line.saleId),
      this.productName()(line.product_id ?? line.productId ?? 0),
    ]),
  );

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      lines: this.api.list(),
      products: this.productsApi.list(),
      sales: this.salesApi.list(),
    }).subscribe({
      next: ({ lines, products, sales }) => {
        this.rows.set(lines);
        this.products.set(products);
        this.sales.set(sales);
        this.loading.set(false);
      },
      error: (err: unknown) => {
        this.rows.set([]);
        this.products.set([]);
        this.sales.set([]);
        this.error.set(toApiMessage(err));
        this.loading.set(false);
      },
    });
  }

  openCreate(): void {
    this.editing.set(null);
    this.resetKey.update((k) => k + 1);
    this.dialogVisible.set(true);
  }

  openEdit(line: ProductSale): void {
    this.editing.set(line);
    this.resetKey.update((k) => k + 1);
    this.dialogVisible.set(true);
  }

  save(payload: ProductSalePayload): void {
    const current = this.editing();
    this.saving.set(true);

    const request = current
      ? this.api.update(current.id, { quantity: payload.quantity })
      : this.api.create(payload);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.notify.success(current ? 'Línea actualizada' : 'Línea agregada a la venta');
        this.load();
      },
      error: (err: unknown) => {
        this.saving.set(false);
        this.notify.error('No se pudo guardar la línea', toApiMessage(err));
      },
    });
  }

  deactivate(line: ProductSale): void {
    this.confirmation.confirm({
      header: 'Baja de línea',
      message: `¿Anular la línea #${line.id}? El backend restaurará ${line.quantity} unidades al stock del producto.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Anular línea',
      rejectLabel: 'Conservar',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => {
        this.api.deactivate(line.id).subscribe({
          next: () => {
            this.notify.warn('Línea anulada y stock devuelto');
            this.load();
          },
          error: (err: unknown) => {
            this.notify.error('No se pudo anular la línea', toApiMessage(err));
          },
        });
      },
    });
  }

  remove(line: ProductSale): void {
    this.confirmation.confirm({
      header: 'Eliminar definitivamente',
      message: `Se borrará la línea #${line.id} y se restaurará el stock de producto.`,
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.api.remove(line.id).subscribe({
          next: () => {
            this.notify.success('Línea eliminada');
            this.load();
          },
          error: (err: unknown) => {
            this.notify.error('No se pudo eliminar la línea', toApiMessage(err));
          },
        });
      },
    });
  }
}
