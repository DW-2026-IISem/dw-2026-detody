import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProductSale, ProductSalePayload } from '../../core/models/product-sale.model';

/**
 * Servicio API para Detalle de Ventas (/api/detalle-ventas).
 * Agregar o editar líneas de venta ajusta el stock de inventario y totales en el backend.
 */
@Injectable({
  providedIn: 'root',
})
export class ProductSaleApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/detalle-ventas`;

  private normalize(item: any): ProductSale {
    if (!item) return item;
    const unitPrice = Number(item.unit_price ?? item.unitPrice ?? 0);
    const quantity = Number(item.quantity ?? 1);
    const subtotal = Number(item.subtotal ?? unitPrice * quantity);

    return {
      ...item,
      sale_id: item.sale_id ?? item.saleId,
      saleId: item.saleId ?? item.sale_id,
      product_id: item.product_id ?? item.productId,
      productId: item.productId ?? item.product_id,
      quantity,
      unit_price: unitPrice,
      unitPrice,
      subtotal,
      status: item.status ?? 'active',
    };
  }

  list(): Observable<ProductSale[]> {
    return this.http.get<any>(this.base).pipe(
      map((response) => {
        let raw: any[] = [];
        if (Array.isArray(response)) {
          raw = response;
        } else if (response?.data?.items && Array.isArray(response.data.items)) {
          raw = response.data.items;
        } else if (response?.product_sales && Array.isArray(response.product_sales)) {
          raw = response.product_sales;
        } else if (response?.items && Array.isArray(response.items)) {
          raw = response.items;
        }
        return raw.map((i) => this.normalize(i));
      }),
    );
  }

  findAll(): Observable<ProductSale[]> {
    return this.list();
  }

  get(id: number): Observable<ProductSale> {
    return this.http.get<any>(`${this.base}/${id}`).pipe(
      map((response) => this.normalize(response?.data ?? response?.product_sale ?? response?.item ?? response)),
    );
  }

  findById(id: number): Observable<ProductSale> {
    return this.get(id);
  }

  create(payload: ProductSalePayload): Observable<ProductSale> {
    const body = {
      ...payload,
      saleId: payload.saleId ?? payload.sale_id,
      sale_id: payload.sale_id ?? payload.saleId,
      productId: payload.productId ?? payload.product_id,
      product_id: payload.product_id ?? payload.productId,
      quantity: Number(payload.quantity),
    };
    return this.http.post<any>(this.base, body).pipe(
      map((response) => this.normalize(response?.data ?? response?.product_sale ?? response?.item ?? response)),
    );
  }

  update(id: number, payload: { quantity: number }): Observable<ProductSale> {
    return this.http.patch<any>(`${this.base}/${id}`, payload).pipe(
      map((response) => this.normalize(response?.data ?? response?.product_sale ?? response?.item ?? response)),
    );
  }

  deactivate(id: number): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/deactivate`, {});
  }

  remove(id: number): Observable<unknown> {
    return this.http.delete(`${this.base}/${id}`);
  }

  delete(id: number): Observable<unknown> {
    return this.remove(id);
  }
}
