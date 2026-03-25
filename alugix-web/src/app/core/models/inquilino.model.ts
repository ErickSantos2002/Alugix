export interface InquilinoRequest {
  nome: string;
  cpf: string;
  telefone: string;
  email?: string;
  rendaMensal?: number;
}

export interface InquilinoResponse {
  id: number;
  nome: string;
  cpf: string;
  telefone: string;
  email?: string;
  rendaMensal?: number;
  ativo: boolean;
  status: string;
  createdAt: string;
}
