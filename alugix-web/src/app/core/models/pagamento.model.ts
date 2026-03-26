export type StatusPagamento = 'PAGO' | 'PENDENTE' | 'ATRASADO';

export interface PagamentoResponse {
  id: number;
  contratoId: number;
  mesReferencia: string;
  dataVencimento: string;
  dataPagamento?: string;
  valorPago: number;
  status: StatusPagamento;
  formaPagamento?: string;
  observacoes?: string;
  createdAt: string;
}

export interface PagamentoRequest {
  valorPago: number;
  dataPagamento: string;
  formaPagamento?: string;
  observacoes?: string;
}
