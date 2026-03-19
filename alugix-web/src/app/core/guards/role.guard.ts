import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// RoleGuard: protege rotas exclusivas de ADMIN.
// Uso na rota: canActivate: [authGuard, roleGuard('ADMIN')]
export const roleGuard = (role: 'ADMIN' | 'USUARIO'): CanActivateFn => {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (auth.getRole() === role) {
      return true;
    }

    // Autenticado mas sem permissão → redireciona para o dashboard
    return router.createUrlTree(['/dashboard']);
  };
};
