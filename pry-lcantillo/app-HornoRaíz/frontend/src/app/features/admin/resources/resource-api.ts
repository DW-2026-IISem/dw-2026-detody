import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Resource, ResourcePayload } from '../../../core/models';

@Injectable({
  providedIn: 'root',
})
export class ResourceApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/resources`;

  findAll(): Observable<Resource[]> {
    return this.http.get<any>(this.baseUrl).pipe(
      map((res) => {
        if (Array.isArray(res)) return res;
        if (res?.items && Array.isArray(res.items)) return res.items;
        if (res?.resources && Array.isArray(res.resources)) return res.resources;
        return [];
      })
    );
  }

  findById(id: number): Observable<Resource> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      map((res) => res?.resource ?? res?.item ?? res)
    );
  }

  create(payload: ResourcePayload): Observable<Resource> {
    return this.http.post<any>(this.baseUrl, payload).pipe(
      map((res) => res?.resource ?? res?.item ?? res)
    );
  }

  update(id: number, payload: Partial<ResourcePayload>): Observable<Resource> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, payload).pipe(
      map((res) => res?.resource ?? res?.item ?? res)
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
