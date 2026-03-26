import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { PagamentoService } from '../../../core/services/pagamento.service';
import { PagamentoResponse } from '../../../core/models/pagamento.model';
import { DateMaskDirective } from '../../../shared/directives/date-mask.directive';

export interface PagarDialogData {
  pagamento: PagamentoResponse;
  valorAluguel: number;
}

@Component({
  selector: 'app-pagar-dialog',
  standalone: true,
  imports: [
    TitleCasePipe, ReactiveFormsModule,
    MatDialogModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule, MatIconModule,
    MatProgressSpinnerModule, MatDatepickerModule, DateMaskDirective,
  ],
  templateUrl: './pagar-dialog.component.html',
  styleUrl: './pagar-dialog.component.scss',
})
export class PagarDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<PagarDialogComponent>);
  private readonly data: PagarDialogData = inject(MAT_DIALOG_DATA);
  private readonly pagamentoService = inject(PagamentoService);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly pagamento = this.data.pagamento;
  readonly valorAluguel = this.data.valorAluguel;

  loading = false;
  erro = '';

  form!: FormGroup;

  readonly formaOpcoes = [
    { value: 'PIX',          label: 'PIX' },
    { value: 'BOLETO',       label: 'Boleto' },
    { value: 'TRANSFERENCIA',label: 'Transferência' },
    { value: 'DINHEIRO',     label: 'Dinheiro' },
  ];

  ngOnInit(): void {
    this.form = this.fb.group({
      valorPago:      [this.valorAluguel, [Validators.required, Validators.min(0.01)]],
      dataPagamento:  [null, [Validators.required]],
      formaPagamento: [null],
      observacoes:    ['', [Validators.maxLength(500)]],
    });
  }

  salvar(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.erro = '';

    const raw = this.form.value;
    const dto = {
      ...raw,
      dataPagamento: this.formatDate(raw.dataPagamento),
      observacoes: raw.observacoes || null,
    };

    this.pagamentoService.pagar(this.pagamento.id, dto).subscribe({
      next: (updated) => {
        this.loading = false;
        this.cdr.detectChanges();
        this.dialogRef.close(updated);
      },
      error: (err) => {
        this.loading = false;
        this.erro = err?.error?.message ?? 'Erro ao registrar pagamento.';
        this.cdr.detectChanges();
      },
    });
  }

  cancelar(): void {
    this.dialogRef.close(null);
  }

  formatarMes(mesReferencia: string): string {
    return new Date(mesReferencia + 'T00:00:00')
      .toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  }

  formatarData(data: string): string {
    return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR');
  }

  formatarValor(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  private formatDate(date: Date): string {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
}
