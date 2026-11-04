import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { Client } from '../../core/models/client.model';
import { Product } from '../../core/models/product.model';
import { Sale } from '../../core/models/sale.model';
import { toApiMessage } from '../../core/utils/api-error';
import { PageHeader } from '../../shared/ui/page-header/page-header';
import { StatusTag } from '../../shared/ui/status-tag/status-tag';
import { ClientApi } from '../clients/client-api';
import { ProductTypeApi } from '../product-types/product-type-api';
import { ProductApi } from '../products/product-api';
import { SaleApi } from '../sales/sale-api';

/**
 * Panel de control central del negocio (Dashboard).
 * Agrega KPIs de clientes, categorías, inventario y facturación sin llamadas duplicadas.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-dashboard',
  imports: [
    CurrencyPipe,
    DatePipe,
    RouterLink,
    ButtonModule,
    CardModule,
    MessageModule,
    PageHeader,
    SkeletonModule,
    StatusTag,
    TableModule,
    TagModule,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private readonly clientsApi = inject(ClientApi);
  private readonly typesApi = inject(ProductTypeApi);
  private readonly productsApi = inject(ProductApi);
  private readonly salesApi = inject(SaleApi);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly clients = signal<Client[]>([]);
  readonly products = signal<Product[]>([]);
  readonly sales = signal<Sale[]>([]);
  readonly typeCount = signal(0);

  /** Productos con existencia menor o igual al umbral mínimo */
  readonly lowStock = computed(() =>
    this.products().filter((p) => (p.quantity ?? p.stock ?? 0) <= (p.min_stock ?? 5)),
  );

  /** Ingresos acumulados calculados exclusivamente de ventas completadas */
  readonly revenue = computed(() =>
    this.sales()
      .filter((s) => s.status !== 'cancelled')
      .reduce((sum, s) => sum + Number(s.total ?? s.total_amount ?? s.totalAmount ?? 0), 0),
  );

  /** Últimas ventas ordenadas cronológicamente */
  readonly latestSales = computed(() =>
    [...this.sales()]
      .sort((a, b) => new Date(b.createdAt ?? '').getTime() - new Date(a.createdAt ?? '').getTime())
      .slice(0, 5),
  );

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      clients: this.clientsApi.list(),
      types: this.typesApi.list(),
      products: this.productsApi.list(),
      sales: this.salesApi.list(),
    }).subscribe({
      next: ({ clients, types, products, sales }) => {
        this.clients.set(clients);
        this.typeCount.set(types.length);
        this.products.set(products);
        this.sales.set(sales);
        this.loading.set(false);
      },
      error: (err: unknown) => {
        this.error.set(toApiMessage(err));
        this.loading.set(false);
      },
    });
  }
}
