export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  tipo: string;
  expiresIn: number;
  nome: string;
  perfil: 'ADMIN' | 'USUARIO';
}
