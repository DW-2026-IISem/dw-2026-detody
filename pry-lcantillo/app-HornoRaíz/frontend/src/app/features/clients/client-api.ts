import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Client, ClientPayload } from '../../core/models';

@Injectable({
  providedIn: 'root',
})
export class ClientApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/clients`;

  /** Lista todos los clientes activos. */
  list(): Observable<Client[]> {
    return this.http.get<any>(this.baseUrl).pipe(
      map((res) => {
        if (Array.isArray(res)) return res;
        if (res?.items && Array.isArray(res.items)) return res.items;
        if (res?.clients && Array.isArray(res.clients)) return res.clients;
        return [];
      }),
    );
  }

  findAll(): Observable<Client[]> {
    return this.list();
  }

  findById(id: number): Observable<Client> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      map((res) => res?.client ?? res?.item ?? res),
    );
  }

  create(payload: ClientPayload): Observable<Client> {
    return this.http.post<any>(this.baseUrl, payload).pipe(
      map((res) => res?.client ?? res?.item ?? res),
    );
  }

  update(id: number, payload: Partial<ClientPayload>): Observable<Client> {
    return this.http.patch<any>(`${this.baseUrl}/${id}`, payload).pipe(
      map((res) => res?.client ?? res?.item ?? res),
    );
  }

  /** Baja lógica: cambia el estado del cliente a inactivo en el backend. */
  deactivate(id: number): Observable<{ message?: string }> {
    return this.http.patch<{ message?: string }>(`${this.baseUrl}/${id}/deactivate`, {});
  }

  /** Baja física: borra definitivamente el registro de la base de datos. */
  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  delete(id: number): Observable<void> {
    return this.remove(id);
  }
}
