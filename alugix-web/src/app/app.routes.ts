import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Redireciona raiz para login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Rota pública
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },

  // Rotas protegidas dentro do layout (sidebar + header)
  {
    path: '',
    loadComponent: () =>
      import('./layout/main-layout/main-layout.component').then((m) => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'imoveis',
        loadComponent: () =>
          import('./features/imoveis/imoveis-list/imoveis-list.component').then((m) => m.ImoveisListComponent),
      },
      {
        path: 'inquilinos',
        loadComponent: () =>
          import('./features/inquilinos/inquilinos-list/inquilinos-list.component').then((m) => m.InquilinosListComponent),
      },
      {
        path: 'contratos',
        loadComponent: () =>
          import('./features/contratos/contratos-list/contratos-list.component').then((m) => m.ContratosListComponent),
      },
      {
        path: 'pagamentos',
        loadComponent: () =>
          import('./features/pagamentos/pagamentos-list/pagamentos-list.component').then((m) => m.PagamentosListComponent),
      },
    ],
  },

  { path: '**', redirectTo: 'login' },
];
