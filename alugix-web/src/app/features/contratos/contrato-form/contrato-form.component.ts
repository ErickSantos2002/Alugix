import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateMaskDirective } from '../../../shared/directives/date-mask.directive';

import { ContratoService } from '../../../core/services/contrato.service';
import { ImovelService } from '../../../core/services/imovel.service';
import { InquilinoService } from '../../../core/services/inquilino.service';
import { ImovelResponse } from '../../../core/models/imovel.model';
import { InquilinoResponse } from '../../../core/models/inquilino.model';

@Component({
  selector: 'app-contrato-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule, MatIconModule,
    MatProgressSpinnerModule, MatDatepickerModule, DateMaskDirective,
  ],
  templateUrl: './contrato-form.component.html',
  styleUrl: './contrato-form.component.scss',
})
export class ContratoFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<ContratoFormComponent>);
  private readonly contratoService = inject(ContratoService);
  private readonly imovelService = inject(ImovelService);
  private readonly inquilinoService = inject(InquilinoService);
  private readonly cdr = inject(ChangeDetectorRef);

  loading = false;
  erro = '';
  errosCampos: string[] = [];

  imoveis: ImovelResponse[] = [];
  inquilinos: InquilinoResponse[] = [];

  form!: FormGroup;

  readonly diasVencimento = Array.from({ length: 28 }, (_, i) => i + 1);

  ngOnInit(): void {
    this.form = this.fb.group({
      imovelId:     [null, [Validators.required]],
      inquilinoId:  [null, [Validators.required]],
      valorAluguel: [null, [Validators.required, Validators.min(0.01)]],
      dataInicio:   [null, [Validators.required]],
      dataTermino:  [null, [Validators.required]],
      diaVencimento:[null, [Validators.required]],
      observacoes:  ['',   [Validators.maxLength(500)]],
    });

    this.carregarImoveis();
    this.carregarInquilinos();
  }

  carregarImoveis(): void {
    this.imovelService.listar(0, 100, { status: 'DISPONIVEL', ativo: true })
      .subscribe({ next: (p) => { this.imoveis = p.content; this.cdr.detectChanges(); } });
  }

  carregarInquilinos(): void {
    this.inquilinoService.listar(0, 100, undefined, true)
      .subscribe({ next: (p) => { this.inquilinos = p.content; this.cdr.detectChanges(); } });
  }

  salvar(): void {
    if (this.form.invalid) return;

    this.loading = true;
    this.erro = '';

    const raw = this.form.value;
    const dto = {
      ...raw,
      dataInicio:  this.formatDate(raw.dataInicio),
      dataTermino: this.formatDate(raw.dataTermino),
      observacoes: raw.observacoes || null,
    };

    this.contratoService.criar(dto).subscribe({
      next: (contrato) => {
        this.loading = false;
        this.cdr.detectChanges();
        this.dialogRef.close(contrato);
      },
      error: (err) => {
        this.loading = false;
        this.erro = err?.error?.message ?? 'Erro ao criar contrato. Tente novamente.';
        this.errosCampos = (err?.error?.errors ?? []).map((e: any) => `${e.field}: ${e.message}`);
        this.cdr.detectChanges();
      },
    });
  }

  private formatDate(date: Date): string {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  cancelar(): void {
    this.dialogRef.close(null);
  }
}
