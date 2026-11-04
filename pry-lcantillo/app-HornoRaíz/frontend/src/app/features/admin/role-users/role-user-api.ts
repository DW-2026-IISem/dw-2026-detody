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
  private readonly baseUrl = `${environment.apiUrl}/role-users`;

  findAll(): Observable<RoleUser[]> {
    return this.http.get<any>(this.baseUrl).pipe(
      map((res) => {
        if (Array.isArray(res)) return res;
        if (res?.items && Array.isArray(res.items)) return res.items;
        if (res?.assignments && Array.isArray(res.assignments)) return res.assignments;
        return [];
      })
    );
  }

  assign(payload: RoleUserPayload): Observable<RoleUser> {
    return this.http.post<any>(this.baseUrl, payload).pipe(
      map((res) => res?.assignment ?? res?.item ?? res)
    );
  }

  revoke(userId: number, roleId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}?user_id=${userId}&role_id=${roleId}`);
  }
}
