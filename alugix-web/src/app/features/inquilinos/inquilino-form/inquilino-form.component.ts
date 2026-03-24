import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { InquilinoService } from '../../../core/services/inquilino.service';
import { InquilinoResponse } from '../../../core/models/inquilino.model';

export type InquilinoFormData = InquilinoResponse | null;

@Component({
  selector: 'app-inquilino-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatProgressSpinnerModule,
  ],
  templateUrl: './inquilino-form.component.html',
  styleUrl: './inquilino-form.component.scss',
})
export class InquilinoFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<InquilinoFormComponent>);
  private readonly inquilinoService = inject(InquilinoService);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly data: InquilinoFormData = inject(MAT_DIALOG_DATA);

  loading = false;
  erro = '';
  errosCampos: string[] = [];

  form!: FormGroup;

  get isEdicao(): boolean {
    return !!this.data;
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      nome:        [this.data?.nome ?? '',        [Validators.required, Validators.maxLength(200)]],
      cpf:         [this.data?.cpf ?? '',         [Validators.required, Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)]],
      telefone:    [this.data?.telefone ?? '',    [Validators.required, Validators.maxLength(20)]],
      email:       [this.data?.email ?? '',       [Validators.email, Validators.maxLength(200)]],
      rendaMensal: [this.data?.rendaMensal ?? null, [Validators.min(0.01)]],
    });
  }

  formatarCpf(event: Event): void {
    const input = event.target as HTMLInputElement;
    let digits = input.value.replace(/\D/g, '').slice(0, 11);
    let formatted = digits;
    if (digits.length > 9) {
      formatted = `${digits.slice(0,3)}.${digits.slice(3,6)}.${digits.slice(6,9)}-${digits.slice(9)}`;
    } else if (digits.length > 6) {
      formatted = `${digits.slice(0,3)}.${digits.slice(3,6)}.${digits.slice(6)}`;
    } else if (digits.length > 3) {
      formatted = `${digits.slice(0,3)}.${digits.slice(3)}`;
    }
    this.form.get('cpf')!.setValue(formatted, { emitEvent: false });
    input.value = formatted;
  }

  formatarTelefone(event: Event): void {
    const input = event.target as HTMLInputElement;
    let digits = input.value.replace(/\D/g, '').slice(0, 11);
    let formatted = digits;
    if (digits.length > 10) {
      formatted = `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7)}`;
    } else if (digits.length > 6) {
      formatted = `(${digits.slice(0,2)}) ${digits.slice(2,6)}-${digits.slice(6)}`;
    } else if (digits.length > 2) {
      formatted = `(${digits.slice(0,2)}) ${digits.slice(2)}`;
    }
    this.form.get('telefone')!.setValue(formatted, { emitEvent: false });
    input.value = formatted;
  }

  salvar(): void {
    if (this.form.invalid) return;

    this.loading = true;
    this.erro = '';

    const raw = this.form.value;
    const dto = {
      ...raw,
      email: raw.email || null,
      rendaMensal: raw.rendaMensal || null,
    };

    const request$ = this.isEdicao
      ? this.inquilinoService.atualizar(this.data!.id, dto)
      : this.inquilinoService.criar(dto);

    request$.subscribe({
      next: (inquilino) => {
        this.loading = false;
        this.cdr.detectChanges();
        this.dialogRef.close(inquilino);
      },
      error: (err) => {
        this.loading = false;
        this.erro = err?.error?.message ?? 'Erro ao salvar inquilino. Tente novamente.';
        this.errosCampos = (err?.error?.errors ?? []).map((e: any) => `${e.field}: ${e.message}`);
        this.cdr.detectChanges();
      },
    });
  }

  cancelar(): void {
    this.dialogRef.close(null);
  }
}
