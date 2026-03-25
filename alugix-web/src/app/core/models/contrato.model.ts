export type StatusContrato = 'ATIVO' | 'ENCERRADO' | 'ATRASADO';

export interface ContratoRequest {
  imovelId: number;
  inquilinoId: number;
  valorAluguel: number;
  dataInicio: string;
  dataTermino: string;
  diaVencimento: number;
  observacoes?: string;
}

export interface ContratoResponse {
  id: number;
  imovel: { id: number; nome: string; endereco: string; tipo: string };
  inquilino: { id: number; nome: string; cpf: string };
  valorAluguel: number;
  dataInicio: string;
  dataTermino: string;
  diaVencimento: number;
  status: StatusContrato;
  observacoes?: string;
  createdAt: string;
}
