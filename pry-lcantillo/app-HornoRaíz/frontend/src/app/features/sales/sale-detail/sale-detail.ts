import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { Product } from '../../../core/models/product.model';
import { Sale } from '../../../core/models/sale.model';
import { StatusTag } from '../../../shared/ui/status-tag/status-tag';

/**
 * Componente presentacional para exhibir el detalle de una venta: cabecera + líneas de productos.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-sale-detail',
  imports: [CurrencyPipe, DatePipe, TableModule, TagModule, StatusTag],
  templateUrl: './sale-detail.html',
  styleUrl: './sale-detail.css',
})
export class SaleDetail {
  readonly sale = input.required<Sale>();
  readonly products = input<Product[]>([]);

  readonly productName = computed(() => {
    const map = new Map(this.products().map((product) => [product.id, product.name]));
    return (id: number) => map.get(id) ?? `Producto #${id}`;
  });

  readonly itemCount = computed(() =>
    (this.sale().items ?? []).reduce((sum, item) => sum + Number(item.quantity ?? 1), 0),
  );
}
