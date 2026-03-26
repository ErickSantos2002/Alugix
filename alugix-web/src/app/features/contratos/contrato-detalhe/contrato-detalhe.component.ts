import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';

import { ContratoService } from '../../../core/services/contrato.service';
import { PagamentoService } from '../../../core/services/pagamento.service';
import { ContratoResponse, StatusContrato } from '../../../core/models/contrato.model';
import { PagamentoResponse, StatusPagamento } from '../../../core/models/pagamento.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { PagarDialogComponent } from '../../pagamentos/pagar-dialog/pagar-dialog.component';

const STATUS_CONTRATO_LABEL: Record<StatusContrato, string> = {
  ATIVO: 'Ativo', ENCERRADO: 'Encerrado', ATRASADO: 'Atrasado',
};

@Component({
  selector: 'app-contrato-detalhe',
  standalone: true,
  imports: [
    FormsModule, TitleCasePipe,
    MatButtonModule, MatIconModule, MatProgressSpinnerModule,
    MatSnackBarModule, MatDialogModule, MatSelectModule, MatTooltipModule,
  ],
  templateUrl: './contrato-detalhe.component.html',
  styleUrl: './contrato-detalhe.component.scss',
})
export class ContratoDetalheComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly contratoService = inject(ContratoService);
  private readonly pagamentoService = inject(PagamentoService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  contrato = signal<ContratoResponse | null>(null);
  pagamentos = signal<PagamentoResponse[]>([]);
  loading = signal(true);
  loadingPagamentos = signal(false);
  filtroPagamento = '';

  readonly pagamentosFiltrados = computed(() => {
    const lista = this.pagamentos();
    if (!this.filtroPagamento) return lista;
    return lista.filter(p => p.status === this.filtroPagamento);
  });

  readonly statusOpcoes = [
    { value: '', label: 'Todos' },
    { value: 'PENDENTE', label: 'Pendente' },
    { value: 'ATRASADO', label: 'Atrasado' },
    { value: 'PAGO', label: 'Pago' },
  ];

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.contratoService.buscarPorId(id).subscribe({
      next: (c) => {
        this.contrato.set(c);
        this.loading.set(false);
        this.carregarPagamentos(c.id);
      },
      error: () => {
        this.snackBar.open('Contrato não encontrado.', 'Fechar', { duration: 3000 });
        this.router.navigate(['/contratos']);
      },
    });
  }

  carregarPagamentos(contratoId: number): void {
    this.loadingPagamentos.set(true);
    this.pagamentoService.listar(contratoId).subscribe({
      next: (page) => { this.pagamentos.set(page.content); this.loadingPagamentos.set(false); },
      error: () => { this.loadingPagamentos.set(false); },
    });
  }

  registrarPagamento(pagamento: PagamentoResponse): void {
    const c = this.contrato();
    if (!c) return;

    const ref = this.dialog.open(PagarDialogComponent, {
      data: { pagamento, valorAluguel: c.valorAluguel },
      width: '500px',
      disableClose: true,
    });

    ref.afterClosed().subscribe((updated: PagamentoResponse | null) => {
      if (!updated) return;
      this.pagamentos.update(lista =>
        lista.map(p => p.id === updated.id ? updated : p)
      );
      this.snackBar.open('Pagamento registrado com sucesso!', 'Fechar', { duration: 3000 });
    });
  }

  voltar(): void {
    this.router.navigate(['/contratos']);
  }

  getStatusContratoLabel(status: StatusContrato): string {
    return STATUS_CONTRATO_LABEL[status] ?? status;
  }

  formatarValor(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  formatarData(data: string): string {
    return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR');
  }

  formatarMes(mesReferencia: string): string {
    return new Date(mesReferencia + 'T00:00:00')
      .toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  }

  getStatusPagamentoLabel(status: StatusPagamento): string {
    return { PAGO: 'Pago', PENDENTE: 'Pendente', ATRASADO: 'Atrasado' }[status] ?? status;
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
