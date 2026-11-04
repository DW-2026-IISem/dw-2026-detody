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
  private readonly baseUrl = `${environment.apiUrl}/resource-roles`;

  findAll(): Observable<ResourceRole[]> {
    return this.http.get<any>(this.baseUrl).pipe(
      map((res) => {
        if (Array.isArray(res)) return res;
        if (res?.items && Array.isArray(res.items)) return res.items;
        if (res?.grants && Array.isArray(res.grants)) return res.grants;
        return [];
      })
    );
  }

  grant(payload: ResourceRolePayload): Observable<ResourceRole> {
    return this.http.post<any>(this.baseUrl, payload).pipe(
      map((res) => res?.grant ?? res?.item ?? res)
    );
  }

  revoke(roleId: number, resourceId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}?role_id=${roleId}&resource_id=${resourceId}`);
  }
}
