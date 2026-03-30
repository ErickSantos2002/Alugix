export type Perfil = 'ADMIN' | 'USUARIO';

export interface UsuarioRequest {
  nome: string;
  email: string;
  senha?: string;
  perfil: Perfil;
}

export interface UsuarioResponse {
  id: number;
  nome: string;
  email: string;
  perfil: Perfil;
  ativo: boolean;
  createdAt: string;
}