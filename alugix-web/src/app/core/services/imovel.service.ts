import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ImovelRequest, ImovelResponse, StatusImovel } from '../models/imovel.model';
import { PageResponse } from '../models/pagination.model';

@Injectable({ providedIn: 'root' })
export class ImovelService {
  private readonly http = inject(HttpClient);
  private readonly BASE = '/api/v1/imoveis';

  // Busca lista paginada. O back aceita: page, size, sort, status, tipo
  listar(page = 0, size = 10, filtros?: { status?: string; tipo?: string; ativo?: boolean }): Observable<PageResponse<ImovelResponse>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', 'createdAt,desc');

    if (filtros?.status) params = params.set('status', filtros.status);
    if (filtros?.tipo)   params = params.set('tipo', filtros.tipo);
    if (filtros?.ativo !== undefined) params = params.set('ativo', String(filtros.ativo));

    return this.http.get<PageResponse<ImovelResponse>>(this.BASE, { params });
  }

  buscarPorId(id: number): Observable<ImovelResponse> {
    return this.http.get<ImovelResponse>(`${this.BASE}/${id}`);
  }

  criar(dto: ImovelRequest): Observable<ImovelResponse> {
    return this.http.post<ImovelResponse>(this.BASE, dto);
  }

  atualizar(id: number, dto: ImovelRequest): Observable<ImovelResponse> {
    return this.http.put<ImovelResponse>(`${this.BASE}/${id}`, dto);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.BASE}/${id}`);
  }

  atualizarStatus(id: number, status: StatusImovel): Observable<ImovelResponse> {
    return this.http.patch<ImovelResponse>(`${this.BASE}/${id}/status`, { status });
  }

  alternarAtivo(id: number): Observable<ImovelResponse> {
    return this.http.patch<ImovelResponse>(`${this.BASE}/${id}/ativo`, {});
  }
}
