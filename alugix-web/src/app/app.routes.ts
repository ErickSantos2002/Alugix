import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Redireciona a raiz para o login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Rota pública de login
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },

  // Rotas protegidas (exigem login)
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent), // placeholder até criar o dashboard
  },

  // Fallback para rota não encontrada
  { path: '**', redirectTo: 'login' },
];
