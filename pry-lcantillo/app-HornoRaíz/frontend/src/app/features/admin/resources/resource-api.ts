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
  private readonly base = `${environment.apiUrl}/recursos`;

  list(): Observable<Resource[]> {
    return this.http.get<any>(this.base).pipe(
      map((res) => {
        if (Array.isArray(res)) return res;
        if (res?.resources && Array.isArray(res.resources)) return res.resources;
        if (res?.data?.resources && Array.isArray(res.data.resources)) return res.data.resources;
        if (res?.items && Array.isArray(res.items)) return res.items;
        if (res?.data && Array.isArray(res.data)) return res.data;
        return [];
      }),
    );
  }

  get(id: number): Observable<Resource> {
    return this.http
      .get<any>(`${this.base}/${id}`)
      .pipe(map((res) => res?.resource ?? res?.data?.resource ?? res?.data ?? res));
  }

  create(payload: ResourcePayload): Observable<Resource> {
    return this.http
      .post<any>(this.base, payload)
      .pipe(map((res) => res?.resource ?? res?.data?.resource ?? res?.data ?? res));
  }

  update(id: number, payload: Partial<ResourcePayload>): Observable<Resource> {
    return this.http
      .patch<any>(`${this.base}/${id}`, payload)
      .pipe(map((res) => res?.resource ?? res?.data?.resource ?? res?.data ?? res));
  }

  deactivate(id: number): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/deactivate`, {});
  }

  remove(id: number): Observable<unknown> {
    return this.http.delete(`${this.base}/${id}`);
  }

  findAll(): Observable<Resource[]> {
    return this.list();
  }

  findById(id: number): Observable<Resource> {
    return this.get(id);
  }

  delete(id: number): Observable<void> {
    return this.remove(id).pipe(map(() => void 0));
  }
}
