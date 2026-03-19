export interface InquilinoRequest {
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  endereco?: string;
}

export interface InquilinoResponse {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  endereco?: string;
  createdAt: string;
  updatedAt: string;
}
