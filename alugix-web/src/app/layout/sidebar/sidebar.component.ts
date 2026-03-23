import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  private readonly authService = inject(AuthService);

  readonly navItems: NavItem[] = [
    { label: 'Dashboard',  icon: 'dashboard',   route: '/dashboard' },
    { label: 'Imóveis',    icon: 'home',         route: '/imoveis' },
    { label: 'Inquilinos', icon: 'people',       route: '/inquilinos' },
    { label: 'Contratos',  icon: 'description',  route: '/contratos' },
    { label: 'Pagamentos', icon: 'payments',     route: '/pagamentos' },
  ];

  isAdmin(): boolean {
    return this.authService.getRole() === 'ADMIN';
  }
}
