import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ResourceRole, ResourceRolePayload } from '../../../core/models';

@Injectable({
  providedIn: 'root',
})
export class ResourceRoleApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/concesiones-rol`;

  list(filters?: { role_id?: number; resource_id?: number }): Observable<ResourceRole[]> {
    let url = this.base;
    const params: string[] = [];
    if (filters?.role_id) params.push(`role_id=${filters.role_id}`);
    if (filters?.resource_id) params.push(`resource_id=${filters.resource_id}`);
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }

    return this.http.get<any>(url).pipe(
      map((res) => {
        if (Array.isArray(res)) return res;
        if (res?.grants && Array.isArray(res.grants)) return res.grants;
        if (res?.data?.grants && Array.isArray(res.data.grants)) return res.data.grants;
        if (res?.items && Array.isArray(res.items)) return res.items;
        if (res?.data && Array.isArray(res.data)) return res.data;
        return [];
      }),
    );
  }

  create(payload: ResourceRolePayload): Observable<ResourceRole> {
    return this.http.post<any>(this.base, payload).pipe(
      map((res) => res?.grant ?? res?.data?.grant ?? res?.data ?? res),
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

  findAll(filters?: { role_id?: number; resource_id?: number }): Observable<ResourceRole[]> {
    return this.list(filters);
  }

  grantPermission(dto: ResourceRolePayload): Observable<ResourceRole> {
    return this.create(dto);
  }

  revokePermission(roleId: number, resourceId: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/resource-roles?role_id=${roleId}&resource_id=${resourceId}`);
  }
}
