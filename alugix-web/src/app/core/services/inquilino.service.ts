import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InquilinoRequest, InquilinoResponse } from '../models/inquilino.model';
import { PageResponse } from '../models/pagination.model';

@Injectable({ providedIn: 'root' })
export class InquilinoService {
  private readonly http = inject(HttpClient);
  private readonly BASE = '/api/v1/inquilinos';

  listar(page = 0, size = 10, busca?: string): Observable<PageResponse<InquilinoResponse>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', 'nome,asc');

    if (busca) params = params.set('busca', busca);

    return this.http.get<PageResponse<InquilinoResponse>>(this.BASE, { params });
  }

  buscarPorId(id: number): Observable<InquilinoResponse> {
    return this.http.get<InquilinoResponse>(`${this.BASE}/${id}`);
  }

  criar(dto: InquilinoRequest): Observable<InquilinoResponse> {
    return this.http.post<InquilinoResponse>(this.BASE, dto);
  }

  atualizar(id: number, dto: InquilinoRequest): Observable<InquilinoResponse> {
    return this.http.put<InquilinoResponse>(`${this.BASE}/${id}`, dto);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.BASE}/${id}`);
  }
}
