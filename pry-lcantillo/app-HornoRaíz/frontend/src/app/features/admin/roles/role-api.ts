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
  private readonly baseUrl = `${environment.apiUrl}/roles`;

  findAll(): Observable<Role[]> {
    return this.http.get<any>(this.baseUrl).pipe(
      map((res) => {
        if (Array.isArray(res)) return res;
        if (res?.items && Array.isArray(res.items)) return res.items;
        if (res?.roles && Array.isArray(res.roles)) return res.roles;
        return [];
      })
    );
  }

  findById(id: number): Observable<Role> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      map((res) => res?.role ?? res?.item ?? res)
    );
  }

  create(payload: RolePayload): Observable<Role> {
    return this.http.post<any>(this.baseUrl, payload).pipe(
      map((res) => res?.role ?? res?.item ?? res)
    );
  }

  update(id: number, payload: Partial<RolePayload>): Observable<Role> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, payload).pipe(
      map((res) => res?.role ?? res?.item ?? res)
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
