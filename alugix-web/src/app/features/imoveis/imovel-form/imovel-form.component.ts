import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ImovelService } from '../../../core/services/imovel.service';
import { ImovelResponse, StatusImovel, TipoImovel } from '../../../core/models/imovel.model';

// Dado recebido ao abrir o dialog (null = novo, ImovelResponse = edição)
export type ImovelFormData = ImovelResponse | null;

@Component({
  selector: 'app-imovel-form',
  imports: [
    ReactiveFormsModule,
    MatDialogModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule, MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './imovel-form.component.html',
  styleUrl: './imovel-form.component.scss',
})
export class ImovelFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<ImovelFormComponent>);
  private readonly imovelService = inject(ImovelService);
  private readonly cdr = inject(ChangeDetectorRef);

  // MAT_DIALOG_DATA: dados passados ao abrir o dialog
  readonly data: ImovelFormData = inject(MAT_DIALOG_DATA);

  loading = false;
  erro = '';
  errosCampos: string[] = [];

  readonly tipoOpcoes: { value: TipoImovel; label: string }[] = [
    { value: 'CASA', label: 'Casa' },
    { value: 'APARTAMENTO', label: 'Apartamento' },
    { value: 'SALA_COMERCIAL', label: 'Sala Comercial' },
  ];

  readonly statusOpcoes: { value: StatusImovel; label: string }[] = [
    { value: 'DISPONIVEL', label: 'Disponível' },
    { value: 'ALUGADO', label: 'Alugado' },
    { value: 'MANUTENCAO', label: 'Manutenção' },
  ];

  form!: FormGroup;

  get isEdicao(): boolean {
    return !!this.data;
  }

  ngOnInit(): void {
    // Pré-preenche o form se for edição
    this.form = this.fb.group({
      nome:         [this.data?.nome ?? '',         [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      endereco:     [this.data?.endereco ?? '',     [Validators.required, Validators.maxLength(200)]],
      cidade:       [this.data?.cidade ?? '',       [Validators.required, Validators.maxLength(100)]],
      estado:       [this.data?.estado ?? '',       [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
      cep:          [this.data?.cep ?? '',          [Validators.required, Validators.pattern(/^\d{5}-?\d{3}$/)]],
      tipo:         [this.data?.tipo ?? '',         [Validators.required]],
      quartos:      [this.data?.quartos ?? null,    [Validators.required, Validators.min(0)]],
      banheiros:    [this.data?.banheiros ?? null,  [Validators.required, Validators.min(0)]],
      areaM2:       [this.data?.areaM2 ?? null,     [Validators.min(1)]],
      valorAluguel: [this.data?.valorAluguel ?? '', [Validators.required, Validators.min(1)]],
      descricao:    [this.data?.descricao ?? '',    [Validators.maxLength(300)]],
    });
  }

  salvar(): void {
    if (this.form.invalid) return;

    this.loading = true;
    this.erro = '';

    const raw = this.form.value;
    const dto = {
      ...raw,
      estado: raw.estado?.toUpperCase(),
      areaM2: raw.areaM2 || null,
      descricao: raw.descricao || null,
    };

    const request$ = this.isEdicao
      ? this.imovelService.atualizar(this.data!.id, dto)
      : this.imovelService.criar(dto);

    request$.subscribe({
      next: (imovel) => {
        this.loading = false;
        this.cdr.detectChanges();
        this.dialogRef.close(imovel);
      },
      error: (err) => {
        this.loading = false;
        this.erro = err?.error?.message ?? 'Erro ao salvar imóvel. Tente novamente.';
        this.errosCampos = (err?.error?.errors ?? []).map((e: any) => `${e.field}: ${e.message}`);
        this.cdr.detectChanges();
      },
    });
  }

  formatarCep(event: Event): void {
    const input = event.target as HTMLInputElement;
    let digits = input.value.replace(/\D/g, '').slice(0, 8);
    const formatted = digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
    this.form.get('cep')!.setValue(formatted, { emitEvent: false });
    input.value = formatted;
  }

  cancelar(): void {
    this.dialogRef.close(null);
  }
}
