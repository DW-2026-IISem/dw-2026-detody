import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { Client } from '../../../core/models/client.model';
import { Product } from '../../../core/models/product.model';
import { Sale } from '../../../core/models/sale.model';
import { NotificationService } from '../../../core/services/notification';
import { toApiMessage } from '../../../core/utils/api-error';
import { filterRows } from '../../../core/utils/filter-rows';
import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { StatusTag } from '../../../shared/ui/status-tag/status-tag';
import { SaleDetail } from '../sale-detail/sale-detail';
import { HasPermission } from '../../../shared/directives/has-permission';
import { ClientApi } from '../../clients/client-api';
import { ProductApi } from '../../products/product-api';
import { SaleApi } from '../sale-api';

/**
 * Listado reactivo de ventas con Signals y resolución de relaciones en tiempo constante.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-sale-list',
  imports: [
    HasPermission,
    CurrencyPipe,
    DatePipe,
    RouterLink,
    ButtonModule,
    DialogModule,
    SaleDetail,
    EmptyState,
    InputTextModule,
    MessageModule,
    PageHeader,
    StatusTag,
    TableModule,
    TagModule,
    TooltipModule,
  ],
  templateUrl: './sale-list.html',
  styleUrl: './sale-list.css',
})
export class SaleList {
  private readonly api = inject(SaleApi);
  private readonly clientsApi = inject(ClientApi);
  private readonly productsApi = inject(ProductApi);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);

  readonly rows = signal<Sale[]>([]);
  readonly clients = signal<Client[]>([]);
  readonly products = signal<Product[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly filter = signal('');
  readonly detailVisible = signal(false);
  readonly selectedSale = signal<Sale | null>(null);
  readonly detailTitle = computed(() => `Detalle de la venta #${this.selectedSale()?.id ?? ''}`);

  readonly clientName = computed(() => {
    const map = new Map(this.clients().map((client) => [client.id, client.name]));
    return (id: number) => map.get(id) ?? `Cliente #${id}`;
  });

  readonly totalRevenue = computed(() =>
    this.rows()
      .filter((s) => s.status !== 'cancelled')
      .reduce((acc, s) => acc + Number(s.total ?? s.total_amount ?? s.totalAmount ?? 0), 0),
  );

  readonly visibleRows = computed(() =>
    filterRows(this.rows(), this.filter(), (sale) => [
      String(sale.id),
      this.clientName()(sale.client_id ?? sale.clientId ?? 0),
      sale.status,
    ]),
  );

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      sales: this.api.list(),
      clients: this.clientsApi.list(),
      products: this.productsApi.list(),
    }).subscribe({
      next: ({ sales, clients, products }) => {
        this.rows.set(sales);
        this.clients.set(clients);
        this.products.set(products);
        this.loading.set(false);
      },
      error: (err: unknown) => {
        this.rows.set([]);
        this.clients.set([]);
        this.products.set([]);
        this.error.set(toApiMessage(err));
        this.loading.set(false);
      },
    });
  }

  openDetail(sale: Sale): void {
    this.selectedSale.set(sale);
    this.detailVisible.set(true);
  }

  itemsCount(sale: Sale): number {
    return (sale.items ?? []).reduce((sum, item) => sum + Number(item.quantity ?? 1), 0);
  }

  deactivate(sale: Sale): void {
    this.confirmation.confirm({
      header: 'Cancelar venta',
      message: `¿Deseas anular la venta #${sale.id}? El backend restaurará el stock de sus productos automáticamente.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Anular venta',
      rejectLabel: 'Conservar',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => {
        this.api.deactivate(sale.id).subscribe({
          next: () => {
            this.notify.warn('Venta anulada y stock restaurado');
            this.load();
          },
          error: (err: unknown) => {
            this.notify.error('No se pudo anular la venta', toApiMessage(err));
          },
        });
      },
    });
  }

  remove(sale: Sale): void {
    this.confirmation.confirm({
      header: 'Eliminar definitivamente',
      message: `Se borrará la venta #${sale.id} y su detalle de la base de datos. Esta acción no se puede deshacer.`,
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.api.remove(sale.id).subscribe({
          next: () => {
            this.notify.success('Venta eliminada');
            this.load();
          },
          error: (err: unknown) => {
            this.notify.error('No se pudo eliminar la venta', toApiMessage(err));
          },
        });
      },
    });
  }
}
