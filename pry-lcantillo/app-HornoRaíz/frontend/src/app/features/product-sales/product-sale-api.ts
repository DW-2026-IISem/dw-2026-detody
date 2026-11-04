import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ProductSale, ProductSalePayload } from '../../core/models';

@Injectable({
  providedIn: 'root',
})
export class ProductSaleApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/product-sales`;

  findAll(): Observable<ProductSale[]> {
    return this.http.get<any>(this.baseUrl).pipe(
      map((res) => {
        if (Array.isArray(res)) return res;
        if (res?.items && Array.isArray(res.items)) return res.items;
        if (res?.product_sales && Array.isArray(res.product_sales)) return res.product_sales;
        if (res?.productSales && Array.isArray(res.productSales)) return res.productSales;
        return [];
      })
    );
  }

  findById(id: number): Observable<ProductSale> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      map((res) => res?.product_sale ?? res?.productSale ?? res?.item ?? res)
    );
  }

  create(payload: ProductSalePayload): Observable<ProductSale> {
    return this.http.post<any>(this.baseUrl, payload).pipe(
      map((res) => res?.product_sale ?? res?.productSale ?? res?.item ?? res)
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
