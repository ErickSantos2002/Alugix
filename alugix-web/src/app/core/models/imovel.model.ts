export type StatusImovel = 'DISPONIVEL' | 'ALUGADO' | 'MANUTENCAO';
export type TipoImovel = 'CASA' | 'APARTAMENTO' | 'SALA_COMERCIAL';

export interface ImovelRequest {
  nome: string;
  endereco: string;
  tipo: TipoImovel;
  valorAluguel: number;
  descricao?: string;
}

export interface ImovelResponse {
  id: number;
  nome: string;
  endereco: string;
  tipo: TipoImovel;
  status: StatusImovel;
  valorAluguel: number;
  descricao?: string;
  createdAt: string;
  updatedAt: string;
}
