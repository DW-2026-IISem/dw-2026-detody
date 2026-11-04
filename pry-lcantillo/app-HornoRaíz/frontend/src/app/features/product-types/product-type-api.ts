import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProductType, ProductTypePayload } from '../../core/models/product-type.model';

/**
 * Servicio API para Tipos de Producto (/api/tipos-producto).
 */
@Injectable({
  providedIn: 'root',
})
export class ProductTypeApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/tipos-producto`;

  list(): Observable<ProductType[]> {
    return this.http.get<any>(this.base).pipe(
      map((response) => {
        if (Array.isArray(response)) return response;
        if (response?.data?.items && Array.isArray(response.data.items)) return response.data.items;
        if (response?.product_types && Array.isArray(response.product_types)) return response.product_types;
        if (response?.items && Array.isArray(response.items)) return response.items;
        return [];
      }),
    );
  }

  findAll(): Observable<ProductType[]> {
    return this.list();
  }

  get(id: number): Observable<ProductType> {
    return this.http.get<any>(`${this.base}/${id}`).pipe(
      map((response) => response?.data ?? response?.product_type ?? response?.productType ?? response?.item ?? response),
    );
  }

  findById(id: number): Observable<ProductType> {
    return this.get(id);
  }

  create(payload: ProductTypePayload): Observable<ProductType> {
    return this.http.post<any>(this.base, payload).pipe(
      map((response) => response?.data ?? response?.product_type ?? response?.productType ?? response?.item ?? response),
    );
  }

  update(id: number, payload: Partial<ProductTypePayload>): Observable<ProductType> {
    return this.http.patch<any>(`${this.base}/${id}`, payload).pipe(
      map((response) => response?.data ?? response?.product_type ?? response?.productType ?? response?.item ?? response),
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
