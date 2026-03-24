import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged } from 'rxjs';

import { ImovelService } from '../../../core/services/imovel.service';
import { ImovelResponse, StatusImovel, TipoImovel } from '../../../core/models/imovel.model';
import { ImovelFormComponent } from '../imovel-form/imovel-form.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

// Mapeamentos para exibição amigável
const STATUS_LABEL: Record<StatusImovel, string> = {
  DISPONIVEL: 'Disponível',
  ALUGADO: 'Alugado',
  MANUTENCAO: 'Manutenção',
};

const TIPO_LABEL: Record<TipoImovel, string> = {
  CASA: 'Casa',
  APARTAMENTO: 'Apartamento',
  SALA_COMERCIAL: 'Sala Comercial',
};

@Component({
  selector: 'app-imoveis-list',
  imports: [
    ReactiveFormsModule,
    MatTableModule, MatPaginatorModule, MatSortModule,
    MatInputModule, MatSelectModule,
    MatButtonModule, MatIconModule, MatChipsModule,
    MatTooltipModule, MatProgressSpinnerModule,
    MatSnackBarModule, MatDialogModule,
  ],
  templateUrl: './imoveis-list.component.html',
  styleUrl: './imoveis-list.component.scss',
})
export class ImoveisListComponent implements OnInit {
  private readonly imovelService = inject(ImovelService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  // Colunas da tabela
  readonly colunas = ['nome', 'tipo', 'endereco', 'valorAluguel', 'status', 'acoes'];

  // Estado da tela
  imoveis = signal<ImovelResponse[]>([]);
  totalElements = signal(0);
  loading = signal(false);
  pageSize = 10;
  pageIndex = 0;

  // Filtros
  readonly filtroStatus = new FormControl('');
  readonly filtroTipo = new FormControl('');

  readonly statusOpcoes: { value: string; label: string }[] = [
    { value: '', label: 'Todos' },
    { value: 'DISPONIVEL', label: 'Disponível' },
    { value: 'ALUGADO', label: 'Alugado' },
    { value: 'MANUTENCAO', label: 'Manutenção' },
  ];

  readonly tipoOpcoes: { value: string; label: string }[] = [
    { value: '', label: 'Todos' },
    { value: 'CASA', label: 'Casa' },
    { value: 'APARTAMENTO', label: 'Apartamento' },
    { value: 'SALA_COMERCIAL', label: 'Sala Comercial' },
  ];

  ngOnInit(): void {
    this.carregar();

    // Recarrega ao mudar filtros (aguarda 300ms após última mudança)
    this.filtroStatus.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => { this.pageIndex = 0; this.carregar(); });

    this.filtroTipo.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => { this.pageIndex = 0; this.carregar(); });
  }

  carregar(): void {
    this.loading.set(true);
    this.imovelService.listar(this.pageIndex, this.pageSize, {
      status: this.filtroStatus.value || undefined,
      tipo: this.filtroTipo.value || undefined,
    }).subscribe({
      next: (page) => {
        this.imoveis.set(page.content);
        this.totalElements.set(page.totalElements);
        this.loading.set(false);
      },
      error: () => {
        this.snackBar.open('Erro ao carregar imóveis.', 'Fechar', { duration: 3000 });
        this.loading.set(false);
      },
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.carregar();
  }

  getStatusLabel(status: StatusImovel): string {
    return STATUS_LABEL[status] ?? status;
  }

  getTipoLabel(tipo: TipoImovel): string {
    return TIPO_LABEL[tipo] ?? tipo;
  }

  formatarValor(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  novoImovel(): void {
    const ref = this.dialog.open(ImovelFormComponent, {
      data: null,
      width: '600px',
      disableClose: true,
    });

    ref.afterClosed().subscribe((resultado) => {
      if (resultado) {
        this.snackBar.open('Imóvel cadastrado com sucesso!', 'Fechar', { duration: 3000 });
        this.carregar();
      }
    });
  }

  editarImovel(imovel: ImovelResponse): void {
    const ref = this.dialog.open(ImovelFormComponent, {
      data: imovel,
      width: '600px',
      disableClose: true,
    });

    ref.afterClosed().subscribe((resultado) => {
      if (resultado) {
        this.snackBar.open('Imóvel atualizado com sucesso!', 'Fechar', { duration: 3000 });
        this.carregar();
      }
    });
  }

  excluirImovel(imovel: ImovelResponse): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        titulo: 'Excluir imóvel',
        mensagem: `Tem certeza que deseja excluir "${imovel.nome}"? Esta ação não pode ser desfeita.`,
        confirmLabel: 'Excluir',
      },
      width: '420px',
    });

    ref.afterClosed().subscribe((confirmado) => {
      if (!confirmado) return;

      this.imovelService.excluir(imovel.id).subscribe({
        next: () => {
          this.snackBar.open('Imóvel excluído com sucesso!', 'Fechar', { duration: 3000 });
          this.carregar();
        },
        error: (err) => {
          const msg = err?.error?.message ?? 'Não foi possível excluir o imóvel.';
          this.snackBar.open(msg, 'Fechar', { duration: 4000 });
        },
      });
    });
  }
}
