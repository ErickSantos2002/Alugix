import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged } from 'rxjs';

import { ContratoService } from '../../../core/services/contrato.service';
import { ContratoResponse, StatusContrato } from '../../../core/models/contrato.model';
import { ContratoFormComponent } from '../contrato-form/contrato-form.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

const STATUS_LABEL: Record<StatusContrato, string> = {
  ATIVO: 'Ativo',
  ENCERRADO: 'Encerrado',
  ATRASADO: 'Atrasado',
};

@Component({
  selector: 'app-contratos-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatTableModule, MatPaginatorModule,
    MatInputModule, MatSelectModule,
    MatButtonModule, MatIconModule,
    MatTooltipModule, MatProgressSpinnerModule,
    MatSnackBarModule, MatDialogModule,
  ],
  templateUrl: './contratos-list.component.html',
  styleUrl: './contratos-list.component.scss',
})
export class ContratosListComponent implements OnInit {
  private readonly contratoService = inject(ContratoService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);

  readonly colunas = ['imovel', 'inquilino', 'valorAluguel', 'periodo', 'diaVencimento', 'status', 'acoes'];

  contratos = signal<ContratoResponse[]>([]);
  totalElements = signal(0);
  loading = signal(false);
  pageSize = 10;
  pageIndex = 0;

  readonly filtroStatus = new FormControl('');

  readonly statusOpcoes: { value: string; label: string }[] = [
    { value: '', label: 'Todos' },
    { value: 'ATIVO', label: 'Ativo' },
    { value: 'ATRASADO', label: 'Atrasado' },
    { value: 'ENCERRADO', label: 'Encerrado' },
  ];

  ngOnInit(): void {
    this.carregar();
    this.filtroStatus.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => { this.pageIndex = 0; this.carregar(); });
  }

  carregar(): void {
    this.loading.set(true);
    const status = (this.filtroStatus.value as StatusContrato) || undefined;
    this.contratoService.listar(this.pageIndex, this.pageSize, status).subscribe({
      next: (page) => {
        this.contratos.set(page.content);
        this.totalElements.set(page.totalElements);
        this.loading.set(false);
      },
      error: () => {
        this.snackBar.open('Erro ao carregar contratos.', 'Fechar', { duration: 3000 });
        this.loading.set(false);
      },
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.carregar();
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

  novoContrato(): void {
    const ref = this.dialog.open(ContratoFormComponent, {
      width: '620px',
      disableClose: true,
    });
    ref.afterClosed().subscribe((res) => {
      if (res) {
        this.snackBar.open('Contrato criado com sucesso!', 'Fechar', { duration: 3000 });
        this.carregar();
      }
    });
  }

  verDetalhe(contrato: ContratoResponse): void {
    this.router.navigate(['/contratos', contrato.id]);
  }

  encerrarContrato(contrato: ContratoResponse): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        titulo: 'Encerrar contrato',
        mensagem: `Tem certeza que deseja encerrar o contrato de "${contrato.inquilino.nome}" no imóvel "${contrato.imovel.nome}"? O imóvel voltará para Disponível.`,
        confirmLabel: 'Encerrar',
      },
      width: '440px',
    });

    ref.afterClosed().subscribe((confirmado) => {
      if (!confirmado) return;
      this.contratoService.encerrar(contrato.id).subscribe({
        next: () => {
          this.snackBar.open('Contrato encerrado com sucesso!', 'Fechar', { duration: 3000 });
          this.carregar();
        },
        error: (err) => {
          const msg = err?.error?.message ?? 'Não foi possível encerrar o contrato.';
          this.snackBar.open(msg, 'Fechar', { duration: 4000 });
        },
      });
    });
  }
}
