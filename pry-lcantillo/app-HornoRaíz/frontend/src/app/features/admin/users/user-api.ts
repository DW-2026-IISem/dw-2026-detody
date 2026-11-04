import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { EffectivePermission, User, UserPayload } from '../../../core/models';

@Injectable({
  providedIn: 'root',
})
export class UserApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/usuarios`;

  list(): Observable<User[]> {
    return this.http.get<any>(this.base).pipe(
      map((res) => {
        if (Array.isArray(res)) return res;
        if (res?.users && Array.isArray(res.users)) return res.users;
        if (res?.data?.users && Array.isArray(res.data.users)) return res.data.users;
        if (res?.items && Array.isArray(res.items)) return res.items;
        if (res?.data && Array.isArray(res.data)) return res.data;
        return [];
      }),
    );
  }

  get(id: number): Observable<User> {
    return this.http
      .get<any>(`${this.base}/${id}`)
      .pipe(map((res) => res?.user ?? res?.data?.user ?? res?.data ?? res));
  }

  create(payload: UserPayload): Observable<User> {
    return this.http
      .post<any>(this.base, payload)
      .pipe(map((res) => res?.user ?? res?.data?.user ?? res?.data ?? res));
  }

  update(id: number, payload: Partial<UserPayload>): Observable<User> {
    return this.http
      .patch<any>(`${this.base}/${id}`, payload)
      .pipe(map((res) => res?.user ?? res?.data?.user ?? res?.data ?? res));
  }

  permissions(id: number): Observable<EffectivePermission[]> {
    return this.http.get<any>(`${this.base}/${id}/permisos`).pipe(
      map((res) => {
        if (Array.isArray(res)) return res;
        if (res?.permissions && Array.isArray(res.permissions)) return res.permissions;
        if (res?.data?.permissions && Array.isArray(res.data.permissions))
          return res.data.permissions;
        if (res?.data && Array.isArray(res.data)) return res.data;
        return [];
      }),
    );
  }

  changePassword(id: number, payload: any): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/password`, payload);
  }

  deactivate(id: number): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/deactivate`, {});
  }

  remove(id: number): Observable<unknown> {
    return this.http.delete(`${this.base}/${id}`);
  }

  findAll(): Observable<User[]> {
    return this.list();
  }

  findById(id: number): Observable<User> {
    return this.get(id);
  }

  delete(id: number): Observable<void> {
    return this.remove(id).pipe(map(() => void 0));
  }
}
