export type StatusPagamento = 'PAGO' | 'PENDENTE' | 'ATRASADO';

export interface PagamentoResponse {
  id: number;
  contratoId: number;
  competencia: string;
  dataVencimento: string;
  dataPagamento?: string;
  valor: number;
  status: StatusPagamento;
}
