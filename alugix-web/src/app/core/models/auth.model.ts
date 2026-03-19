export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
  usuario: {
    id: number;
    nome: string;
    email: string;
    perfil: 'ADMIN' | 'USUARIO';
  };
}
