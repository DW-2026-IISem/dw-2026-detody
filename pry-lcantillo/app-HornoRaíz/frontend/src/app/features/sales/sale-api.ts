import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Sale, SaleCreatePayload, SaleUpdatePayload } from '../../core/models/sale.model';

/**
 * Servicio API para Ventas (/api/ventas).
 * La creación de una venta es atómica y transaccional (cabecera + detalle + descuento de stock).
 */
@Injectable({
  providedIn: 'root',
})
export class SaleApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/ventas`;

  private normalize(sale: any): Sale {
    if (!sale) return sale;
    const totalVal = Number(sale.total ?? sale.total_amount ?? sale.totalAmount ?? 0);
    const normalizedItems = (sale.items ?? []).map((i: any) => ({
      ...i,
      product_id: i.product_id ?? i.productId,
      productId: i.productId ?? i.product_id,
      quantity: Number(i.quantity ?? 1),
      unit_price: Number(i.unit_price ?? i.unitPrice ?? 0),
      unitPrice: Number(i.unitPrice ?? i.unit_price ?? 0),
      subtotal: Number(
        i.subtotal ?? Number(i.unit_price ?? i.unitPrice ?? 0) * Number(i.quantity ?? 1),
      ),
    }));

    return {
      ...sale,
      client_id: sale.client_id ?? sale.clientId,
      clientId: sale.clientId ?? sale.client_id,
      total: totalVal,
      total_amount: totalVal,
      totalAmount: totalVal,
      status: sale.status ?? 'completed',
      items: normalizedItems,
    };
  }

  list(): Observable<Sale[]> {
    return this.http.get<any>(this.base).pipe(
      map((response) => {
        let rawList: any[] = [];
        if (Array.isArray(response)) {
          rawList = response;
        } else if (response?.data?.items && Array.isArray(response.data.items)) {
          rawList = response.data.items;
        } else if (response?.sales && Array.isArray(response.sales)) {
          rawList = response.sales;
        } else if (response?.items && Array.isArray(response.items)) {
          rawList = response.items;
        }
        return rawList.map((item) => this.normalize(item));
      }),
    );
  }

  findAll(): Observable<Sale[]> {
    return this.list();
  }

  get(id: number): Observable<Sale> {
    return this.http
      .get<any>(`${this.base}/${id}`)
      .pipe(
        map((response) =>
          this.normalize(response?.data ?? response?.sale ?? response?.item ?? response),
        ),
      );
  }

  findById(id: number): Observable<Sale> {
    return this.get(id);
  }

  create(payload: SaleCreatePayload): Observable<Sale> {
    const body = {
      ...payload,
      clientId: payload.clientId ?? payload.client_id,
      client_id: payload.client_id ?? payload.clientId,
      items: (payload.items ?? []).map((i) => ({
        ...i,
        productId: i.productId ?? i.product_id,
        product_id: i.product_id ?? i.productId,
        quantity: Number(i.quantity),
      })),
    };
    return this.http
      .post<any>(this.base, body)
      .pipe(
        map((response) =>
          this.normalize(response?.data ?? response?.sale ?? response?.item ?? response),
        ),
      );
  }

  update(id: number, payload: Partial<SaleUpdatePayload>): Observable<Sale> {
    return this.http
      .patch<any>(`${this.base}/${id}`, payload)
      .pipe(
        map((response) =>
          this.normalize(response?.data ?? response?.sale ?? response?.item ?? response),
        ),
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
