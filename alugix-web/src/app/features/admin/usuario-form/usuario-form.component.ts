import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UsuarioService } from '../../../core/services/usuario.service';
import { UsuarioResponse } from '../../../core/models/usuario.model';

export interface UsuarioFormData {
  usuario?: UsuarioResponse;
}

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './usuario-form.component.html',
  styleUrl: './usuario-form.component.scss',
})
export class UsuarioFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<UsuarioFormComponent>);
  private readonly usuarioService = inject(UsuarioService);
  readonly data = inject<UsuarioFormData>(MAT_DIALOG_DATA);

  readonly isEdicao = !!this.data?.usuario;
  salvando = false;
  mostrarSenha = false;

  readonly perfisOpcoes = [
    { value: 'USUARIO', label: 'Usuário' },
    { value: 'ADMIN', label: 'Administrador' },
  ];

  readonly form = this.fb.group({
    nome:   ['', [Validators.required, Validators.maxLength(150)]],
    email:  ['', [Validators.required, Validators.email, Validators.maxLength(200)]],
    senha:  ['', this.isEdicao ? [Validators.minLength(6)] : [Validators.required, Validators.minLength(6)]],
    perfil: ['USUARIO', Validators.required],
  });

  ngOnInit(): void {
    if (this.isEdicao) {
      const u = this.data.usuario!;
      this.form.patchValue({ nome: u.nome, email: u.email, perfil: u.perfil });
    }
  }

  salvar(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.salvando = true;

    const dto: any = {
      nome: this.form.value.nome!,
      email: this.form.value.email!,
      perfil: this.form.value.perfil as any,
    };
    if (this.form.value.senha) dto.senha = this.form.value.senha;

    const req = this.isEdicao
      ? this.usuarioService.atualizar(this.data.usuario!.id, dto)
      : this.usuarioService.criar(dto);

    req.subscribe({
      next: (u) => this.dialogRef.close(u),
      error: () => { this.salvando = false; },
    });
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}