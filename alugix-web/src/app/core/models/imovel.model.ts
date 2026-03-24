export type StatusImovel = 'DISPONIVEL' | 'ALUGADO' | 'MANUTENCAO';
export type TipoImovel = 'CASA' | 'APARTAMENTO' | 'SALA_COMERCIAL';

export interface ImovelRequest {
  nome: string;
  endereco: string;
  cep: string;
  cidade: string;
  estado: string;
  tipo: TipoImovel;
  quartos: number;
  banheiros: number;
  areaM2?: number;
  valorAluguel: number;
  descricao?: string;
  status?: StatusImovel;
}

export interface ImovelResponse {
  id: number;
  nome: string;
  endereco: string;
  cep: string;
  cidade: string;
  estado: string;
  tipo: TipoImovel;
  status: StatusImovel;
  quartos: number;
  banheiros: number;
  areaM2?: number;
  valorAluguel: number;
  ativo: boolean;
  descricao?: string;
  createdAt: string;
}
