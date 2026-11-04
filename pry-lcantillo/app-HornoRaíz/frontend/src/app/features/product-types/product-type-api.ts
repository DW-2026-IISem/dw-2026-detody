import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ProductType, ProductTypePayload } from '../../core/models';

@Injectable({
  providedIn: 'root',
})
export class ProductTypeApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/product-types`;

  findAll(): Observable<ProductType[]> {
    return this.http.get<any>(this.baseUrl).pipe(
      map((res) => {
        if (Array.isArray(res)) return res;
        if (res?.items && Array.isArray(res.items)) return res.items;
        if (res?.product_types && Array.isArray(res.product_types)) return res.product_types;
        if (res?.productTypes && Array.isArray(res.productTypes)) return res.productTypes;
        return [];
      })
    );
  }

  findById(id: number): Observable<ProductType> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      map((res) => res?.product_type ?? res?.productType ?? res?.item ?? res)
    );
  }

  create(payload: ProductTypePayload): Observable<ProductType> {
    return this.http.post<any>(this.baseUrl, payload).pipe(
      map((res) => res?.product_type ?? res?.productType ?? res?.item ?? res)
    );
  }

  update(id: number, payload: Partial<ProductTypePayload>): Observable<ProductType> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, payload).pipe(
      map((res) => res?.product_type ?? res?.productType ?? res?.item ?? res)
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
