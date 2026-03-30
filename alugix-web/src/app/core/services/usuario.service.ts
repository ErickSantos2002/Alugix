import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioRequest, UsuarioResponse } from '../models/usuario.model';

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private readonly http = inject(HttpClient);
  private readonly base = '/api/v1/usuarios';

  listar(page = 0, size = 10, ativo?: boolean): Observable<PageResponse<UsuarioResponse>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', 'nome,asc');
    if (ativo !== undefined) params = params.set('ativo', ativo);
    return this.http.get<PageResponse<UsuarioResponse>>(this.base, { params });
  }

  buscarPorId(id: number): Observable<UsuarioResponse> {
    return this.http.get<UsuarioResponse>(`${this.base}/${id}`);
  }

  criar(dto: UsuarioRequest): Observable<UsuarioResponse> {
    return this.http.post<UsuarioResponse>(this.base, dto);
  }

  atualizar(id: number, dto: UsuarioRequest): Observable<UsuarioResponse> {
    return this.http.put<UsuarioResponse>(`${this.base}/${id}`, dto);
  }

  alternarAtivo(id: number): Observable<UsuarioResponse> {
    return this.http.patch<UsuarioResponse>(`${this.base}/${id}/ativo`, {});
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}