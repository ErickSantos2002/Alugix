import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged } from 'rxjs';

import { InquilinoService } from '../../../core/services/inquilino.service';
import { InquilinoResponse } from '../../../core/models/inquilino.model';
import { InquilinoFormComponent } from '../inquilino-form/inquilino-form.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-inquilinos-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatTableModule, MatPaginatorModule,
    MatInputModule, MatButtonModule, MatIconModule,
    MatTooltipModule, MatProgressSpinnerModule,
    MatSnackBarModule, MatDialogModule,
  ],
  templateUrl: './inquilinos-list.component.html',
  styleUrl: './inquilinos-list.component.scss',
})
export class InquilinosListComponent implements OnInit {
  private readonly inquilinoService = inject(InquilinoService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  readonly colunas = ['nome', 'cpf', 'telefone', 'email', 'rendaMensal', 'acoes'];

  inquilinos = signal<InquilinoResponse[]>([]);
  totalElements = signal(0);
  loading = signal(false);
  pageSize = 10;
  pageIndex = 0;

  readonly filtroBusca = new FormControl('');

  ngOnInit(): void {
    this.carregar();

    this.filtroBusca.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => { this.pageIndex = 0; this.carregar(); });
  }

  carregar(): void {
    this.loading.set(true);
    this.inquilinoService.listar(this.pageIndex, this.pageSize, this.filtroBusca.value || undefined)
      .subscribe({
        next: (page) => {
          this.inquilinos.set(page.content);
          this.totalElements.set(page.totalElements);
          this.loading.set(false);
        },
        error: () => {
          this.snackBar.open('Erro ao carregar inquilinos.', 'Fechar', { duration: 3000 });
          this.loading.set(false);
        },
      });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.carregar();
  }

  formatarRenda(valor?: number): string {
    if (!valor) return '—';
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  novoInquilino(): void {
    const ref = this.dialog.open(InquilinoFormComponent, {
      data: null,
      width: '560px',
      disableClose: true,
    });
    ref.afterClosed().subscribe((res) => {
      if (res) {
        this.snackBar.open('Inquilino cadastrado com sucesso!', 'Fechar', { duration: 3000 });
        this.carregar();
      }
    });
  }

  editarInquilino(inquilino: InquilinoResponse): void {
    const ref = this.dialog.open(InquilinoFormComponent, {
      data: inquilino,
      width: '560px',
      disableClose: true,
    });
    ref.afterClosed().subscribe((res) => {
      if (res) {
        this.snackBar.open('Inquilino atualizado com sucesso!', 'Fechar', { duration: 3000 });
        this.carregar();
      }
    });
  }

  excluirInquilino(inquilino: InquilinoResponse): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        titulo: 'Excluir inquilino',
        mensagem: `Tem certeza que deseja excluir "${inquilino.nome}"? Esta ação não pode ser desfeita.`,
        confirmLabel: 'Excluir',
      },
      width: '420px',
    });

    ref.afterClosed().subscribe((confirmado) => {
      if (!confirmado) return;
      this.inquilinoService.excluir(inquilino.id).subscribe({
        next: () => {
          this.snackBar.open('Inquilino excluído com sucesso!', 'Fechar', { duration: 3000 });
          this.carregar();
        },
        error: (err) => {
          const msg = err?.error?.message ?? 'Não foi possível excluir o inquilino.';
          this.snackBar.open(msg, 'Fechar', { duration: 4000 });
        },
      });
    });
  }
}
