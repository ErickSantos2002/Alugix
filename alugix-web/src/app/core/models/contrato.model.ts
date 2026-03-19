export type StatusContrato = 'ATIVO' | 'ENCERRADO' | 'ATRASADO';

export interface ContratoRequest {
  imovelId: number;
  inquilinoId: number;
  dataInicio: string;
  dataFim: string;
  valorAluguel: number;
  diaVencimento: number;
}

export interface ContratoResponse {
  id: number;
  imovel: { id: number; nome: string; endereco: string };
  inquilino: { id: number; nome: string; cpf: string };
  dataInicio: string;
  dataFim: string;
  valorAluguel: number;
  diaVencimento: number;
  status: StatusContrato;
  createdAt: string;
  updatedAt: string;
}
