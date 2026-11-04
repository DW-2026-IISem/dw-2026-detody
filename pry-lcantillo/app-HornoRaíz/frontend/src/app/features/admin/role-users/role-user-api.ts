import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { RoleUser, RoleUserPayload } from '../../../core/models';

@Injectable({
  providedIn: 'root',
})
export class RoleUserApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/asignaciones-rol`;

  list(): Observable<RoleUser[]> {
    return this.http.get<any>(this.base).pipe(
      map((res) => {
        if (Array.isArray(res)) return res;
        if (res?.assignments && Array.isArray(res.assignments)) return res.assignments;
        if (res?.data?.assignments && Array.isArray(res.data.assignments)) return res.data.assignments;
        if (res?.items && Array.isArray(res.items)) return res.items;
        if (res?.data && Array.isArray(res.data)) return res.data;
        return [];
      }),
    );
  }

  create(payload: RoleUserPayload): Observable<RoleUser> {
    return this.http.post<any>(this.base, payload).pipe(
      map((res) => res?.assignment ?? res?.data?.assignment ?? res?.data ?? res),
    );
  }

  deactivate(id: number): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/deactivate`, {});
  }

  reactivate(id: number): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/reactivate`, {});
  }

  remove(id: number): Observable<unknown> {
    return this.http.delete(`${this.base}/${id}`);
  }

  findAll(): Observable<RoleUser[]> {
    return this.list();
  }

  assignRole(dto: RoleUserPayload): Observable<RoleUser> {
    return this.create(dto);
  }

  revokeRole(userId: number, roleId: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/role-users?user_id=${userId}&role_id=${roleId}`);
  }
}
