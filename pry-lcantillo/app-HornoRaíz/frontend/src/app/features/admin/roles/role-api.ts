import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Role, RolePayload } from '../../../core/models';

@Injectable({
  providedIn: 'root',
})
export class RoleApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/roles`;

  list(): Observable<Role[]> {
    return this.http.get<any>(this.base).pipe(
      map((res) => {
        if (Array.isArray(res)) return res;
        if (res?.roles && Array.isArray(res.roles)) return res.roles;
        if (res?.data?.roles && Array.isArray(res.data.roles)) return res.data.roles;
        if (res?.items && Array.isArray(res.items)) return res.items;
        if (res?.data && Array.isArray(res.data)) return res.data;
        return [];
      }),
    );
  }

  get(id: number): Observable<Role> {
    return this.http
      .get<any>(`${this.base}/${id}`)
      .pipe(map((res) => res?.role ?? res?.data?.role ?? res?.data ?? res));
  }

  create(payload: RolePayload): Observable<Role> {
    return this.http
      .post<any>(this.base, payload)
      .pipe(map((res) => res?.role ?? res?.data?.role ?? res?.data ?? res));
  }

  update(id: number, payload: Partial<RolePayload>): Observable<Role> {
    return this.http
      .patch<any>(`${this.base}/${id}`, payload)
      .pipe(map((res) => res?.role ?? res?.data?.role ?? res?.data ?? res));
  }

  deactivate(id: number): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/deactivate`, {});
  }

  remove(id: number): Observable<unknown> {
    return this.http.delete(`${this.base}/${id}`);
  }

  findAll(): Observable<Role[]> {
    return this.list();
  }

  findById(id: number): Observable<Role> {
    return this.get(id);
  }

  delete(id: number): Observable<void> {
    return this.remove(id).pipe(map(() => void 0));
  }
}
