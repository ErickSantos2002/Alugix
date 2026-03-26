import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-pagamentos-list',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './pagamentos-list.component.html',
  styleUrl: './pagamentos-list.component.scss',
})
export class PagamentosListComponent {
  private readonly router = inject(Router);

  irParaContratos(): void {
    this.router.navigate(['/contratos']);
  }
}
