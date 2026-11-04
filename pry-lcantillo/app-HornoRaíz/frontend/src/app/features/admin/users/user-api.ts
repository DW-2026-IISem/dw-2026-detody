import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { User, UserPayload } from '../../../core/models';

@Injectable({
  providedIn: 'root',
})
export class UserApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/users`;

  findAll(): Observable<User[]> {
    return this.http.get<any>(this.baseUrl).pipe(
      map((res) => {
        if (Array.isArray(res)) return res;
        if (res?.items && Array.isArray(res.items)) return res.items;
        if (res?.users && Array.isArray(res.users)) return res.users;
        return [];
      })
    );
  }

  findById(id: number): Observable<User> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      map((res) => res?.user ?? res?.item ?? res)
    );
  }

  create(payload: UserPayload): Observable<User> {
    return this.http.post<any>(this.baseUrl, payload).pipe(
      map((res) => res?.user ?? res?.item ?? res)
    );
  }

  update(id: number, payload: Partial<UserPayload>): Observable<User> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, payload).pipe(
      map((res) => res?.user ?? res?.item ?? res)
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
