import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ContratoRequest, ContratoResponse, StatusContrato } from '../models/contrato.model';
import { PageResponse } from '../models/pagination.model';

@Injectable({ providedIn: 'root' })
export class ContratoService {
  private readonly http = inject(HttpClient);
  private readonly BASE = '/api/v1/contratos';

  listar(page = 0, size = 10, status?: StatusContrato): Observable<PageResponse<ContratoResponse>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', 'createdAt,desc');

    if (status) params = params.set('status', status);

    return this.http.get<PageResponse<ContratoResponse>>(this.BASE, { params });
  }

  buscarPorId(id: number): Observable<ContratoResponse> {
    return this.http.get<ContratoResponse>(`${this.BASE}/${id}`);
  }

  criar(dto: ContratoRequest): Observable<ContratoResponse> {
    return this.http.post<ContratoResponse>(this.BASE, dto);
  }

  encerrar(id: number): Observable<ContratoResponse> {
    return this.http.patch<ContratoResponse>(`${this.BASE}/${id}/encerrar`, {});
  }
}
