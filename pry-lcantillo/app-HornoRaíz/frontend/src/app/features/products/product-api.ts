import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product, ProductPayload } from '../../core/models/product.model';

/**
 * Servicio API para Productos (/api/productos).
 * El backend valida que el ProductType exista y esté activo.
 */
@Injectable({
  providedIn: 'root',
})
export class ProductApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/productos`;

  private normalize(p: any): Product {
    if (!p) return p;
    return {
      ...p,
      product_type_id: p.product_type_id ?? p.productTypeId,
      productTypeId: p.productTypeId ?? p.product_type_id,
      quantity: p.quantity !== undefined ? p.quantity : (p.stock ?? 0),
      stock: p.stock !== undefined ? p.stock : (p.quantity ?? 0),
      min_stock: p.min_stock !== undefined ? p.min_stock : 5,
    };
  }

  list(): Observable<Product[]> {
    return this.http.get<any>(this.base).pipe(
      map((response) => {
        let rawList: any[] = [];
        if (Array.isArray(response)) {
          rawList = response;
        } else if (response?.data?.items && Array.isArray(response.data.items)) {
          rawList = response.data.items;
        } else if (response?.products && Array.isArray(response.products)) {
          rawList = response.products;
        } else if (response?.items && Array.isArray(response.items)) {
          rawList = response.items;
        }
        return rawList.map((item) => this.normalize(item));
      }),
    );
  }

  findAll(): Observable<Product[]> {
    return this.list();
  }

  get(id: number): Observable<Product> {
    return this.http
      .get<any>(`${this.base}/${id}`)
      .pipe(
        map((response) =>
          this.normalize(response?.data ?? response?.product ?? response?.item ?? response),
        ),
      );
  }

  findById(id: number): Observable<Product> {
    return this.get(id);
  }

  create(payload: ProductPayload): Observable<Product> {
    const body = {
      ...payload,
      productTypeId: payload.productTypeId ?? payload.product_type_id,
      product_type_id: payload.product_type_id ?? payload.productTypeId,
      stock: payload.stock ?? payload.quantity ?? 0,
      price: Number(payload.price),
    };
    return this.http
      .post<any>(this.base, body)
      .pipe(
        map((response) =>
          this.normalize(response?.data ?? response?.product ?? response?.item ?? response),
        ),
      );
  }

  update(id: number, payload: Partial<ProductPayload>): Observable<Product> {
    const body: any = { ...payload };
    if (payload.product_type_id !== undefined || payload.productTypeId !== undefined) {
      body.productTypeId = payload.productTypeId ?? payload.product_type_id;
    }
    if (payload.quantity !== undefined || payload.stock !== undefined) {
      body.stock = payload.stock ?? payload.quantity;
    }
    if (payload.price !== undefined) {
      body.price = Number(payload.price);
    }
    return this.http
      .patch<any>(`${this.base}/${id}`, body)
      .pipe(
        map((response) =>
          this.normalize(response?.data ?? response?.product ?? response?.item ?? response),
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
