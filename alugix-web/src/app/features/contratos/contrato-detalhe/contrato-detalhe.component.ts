import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';

import { ContratoService } from '../../../core/services/contrato.service';
import { ContratoResponse, StatusContrato } from '../../../core/models/contrato.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

const STATUS_LABEL: Record<StatusContrato, string> = {
  ATIVO: 'Ativo',
  ENCERRADO: 'Encerrado',
  ATRASADO: 'Atrasado',
};

@Component({
  selector: 'app-contrato-detalhe',
  standalone: true,
  imports: [
    MatButtonModule, MatIconModule,
    MatProgressSpinnerModule, MatSnackBarModule,
    MatDialogModule, MatDividerModule, MatChipsModule,
  ],
  templateUrl: './contrato-detalhe.component.html',
  styleUrl: './contrato-detalhe.component.scss',
})
export class ContratoDetalheComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly contratoService = inject(ContratoService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  contrato = signal<ContratoResponse | null>(null);
  loading = signal(true);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.contratoService.buscarPorId(id).subscribe({
      next: (c) => { this.contrato.set(c); this.loading.set(false); },
      error: () => {
        this.snackBar.open('Contrato não encontrado.', 'Fechar', { duration: 3000 });
        this.router.navigate(['/contratos']);
      },
    });
  }

  voltar(): void {
    this.router.navigate(['/contratos']);
  }

  getStatusLabel(status: StatusContrato): string {
    return STATUS_LABEL[status] ?? status;
  }

  formatarValor(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  formatarData(data: string): string {
    return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR');
  }

  encerrarContrato(): void {
    const c = this.contrato();
    if (!c) return;

    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        titulo: 'Encerrar contrato',
        mensagem: `Tem certeza que deseja encerrar o contrato de "${c.inquilino.nome}" no imóvel "${c.imovel.nome}"? O imóvel voltará para Disponível.`,
        confirmLabel: 'Encerrar',
      },
      width: '440px',
    });

    ref.afterClosed().subscribe((confirmado) => {
      if (!confirmado) return;
      this.loading.set(true);
      this.contratoService.encerrar(c.id).subscribe({
        next: (updated) => {
          this.contrato.set(updated);
          this.loading.set(false);
          this.snackBar.open('Contrato encerrado com sucesso!', 'Fechar', { duration: 3000 });
        },
        error: (err) => {
          this.loading.set(false);
          const msg = err?.error?.message ?? 'Não foi possível encerrar o contrato.';
          this.snackBar.open(msg, 'Fechar', { duration: 4000 });
        },
      });
    });
  }
}
