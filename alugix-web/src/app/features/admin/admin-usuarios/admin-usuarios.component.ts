import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { DatePipe } from '@angular/common';
import { UsuarioService } from '../../../core/services/usuario.service';
import { UsuarioResponse } from '../../../core/models/usuario.model';
import { UsuarioFormComponent } from '../usuario-form/usuario-form.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-admin-usuarios',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DatePipe,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatChipsModule,
  ],
  templateUrl: './admin-usuarios.component.html',
  styleUrl: './admin-usuarios.component.scss',
})
export class AdminUsuariosComponent implements OnInit {
  private readonly usuarioService = inject(UsuarioService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  readonly colunas = ['nome', 'perfil', 'ativo', 'createdAt', 'acoes'];
  readonly usuarios = signal<UsuarioResponse[]>([]);
  readonly totalElementos = signal(0);
  readonly loading = signal(true);

  page = 0;
  size = 10;

  readonly filtroAtivo = new FormControl<string>('');

  ngOnInit(): void {
    this.filtroAtivo.valueChanges.subscribe(() => { this.page = 0; this.carregar(); });
    this.carregar();
  }

  carregar(): void {
    this.loading.set(true);
    const ativo = this.filtroAtivo.value === 'true' ? true
                : this.filtroAtivo.value === 'false' ? false
                : undefined;

    this.usuarioService.listar(this.page, this.size, ativo).subscribe({
      next: (p) => { this.usuarios.set(p.content); this.totalElementos.set(p.totalElements); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  paginar(event: PageEvent): void {
    this.page = event.pageIndex;
    this.size = event.pageSize;
    this.carregar();
  }

  novoUsuario(): void {
    this.dialog.open(UsuarioFormComponent, { width: '480px', data: {} })
      .afterClosed().subscribe(u => { if (u) { this.snackBar.open('Usuário criado!', '', { duration: 3000 }); this.carregar(); } });
  }

  editarUsuario(usuario: UsuarioResponse): void {
    this.dialog.open(UsuarioFormComponent, { width: '480px', data: { usuario } })
      .afterClosed().subscribe(u => { if (u) { this.snackBar.open('Usuário atualizado!', '', { duration: 3000 }); this.carregar(); } });
  }

  alternarAtivo(usuario: UsuarioResponse): void {
    const acao = usuario.ativo ? 'desativar' : 'reativar';
    this.dialog.open(ConfirmDialogComponent, {
      data: { titulo: `${usuario.ativo ? 'Desativar' : 'Reativar'} usuário`, mensagem: `Deseja ${acao} ${usuario.nome}?` }
    }).afterClosed().subscribe(ok => {
      if (!ok) return;
      this.usuarioService.alternarAtivo(usuario.id).subscribe({
        next: () => { this.snackBar.open(`Usuário ${acao === 'desativar' ? 'desativado' : 'reativado'}!`, '', { duration: 3000 }); this.carregar(); },
      });
    });
  }

  excluirUsuario(usuario: UsuarioResponse): void {
    this.dialog.open(ConfirmDialogComponent, {
      data: { titulo: 'Excluir usuário', mensagem: `Excluir permanentemente ${usuario.nome}? Esta ação não pode ser desfeita.`, confirmColor: 'warn' }
    }).afterClosed().subscribe(ok => {
      if (!ok) return;
      this.usuarioService.deletar(usuario.id).subscribe({
        next: () => { this.snackBar.open('Usuário excluído!', '', { duration: 3000 }); this.carregar(); },
      });
    });
  }
}