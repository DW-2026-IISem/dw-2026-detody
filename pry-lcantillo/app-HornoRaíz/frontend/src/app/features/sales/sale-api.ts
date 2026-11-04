import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Sale, SaleCreatePayload, SaleUpdatePayload } from '../../core/models';

@Injectable({
  providedIn: 'root',
})
export class SaleApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/sales`;

  findAll(): Observable<Sale[]> {
    return this.http.get<any>(this.baseUrl).pipe(
      map((res) => {
        if (Array.isArray(res)) return res;
        if (res?.items && Array.isArray(res.items)) return res.items;
        if (res?.sales && Array.isArray(res.sales)) return res.sales;
        return [];
      })
    );
  }

  findById(id: number): Observable<Sale> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      map((res) => res?.sale ?? res?.item ?? res)
    );
  }

  create(payload: SaleCreatePayload): Observable<Sale> {
    return this.http.post<any>(this.baseUrl, payload).pipe(
      map((res) => res?.sale ?? res?.item ?? res)
    );
  }

  update(id: number, payload: Partial<SaleUpdatePayload>): Observable<Sale> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, payload).pipe(
      map((res) => res?.sale ?? res?.item ?? res)
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
