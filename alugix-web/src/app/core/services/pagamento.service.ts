import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagamentoRequest, PagamentoResponse } from '../models/pagamento.model';
import { PageResponse } from '../models/pagination.model';

@Injectable({ providedIn: 'root' })
export class PagamentoService {
  private readonly http = inject(HttpClient);

  listar(contratoId: number, page = 0, size = 50): Observable<PageResponse<PagamentoResponse>> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', 'dataVencimento,asc');
    return this.http.get<PageResponse<PagamentoResponse>>(
      `/api/v1/contratos/${contratoId}/pagamentos`, { params }
    );
  }

  pagar(id: number, dto: PagamentoRequest): Observable<PagamentoResponse> {
    return this.http.patch<PagamentoResponse>(`/api/v1/pagamentos/${id}/pagar`, dto);
  }
}
