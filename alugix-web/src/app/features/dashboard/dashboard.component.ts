import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DashboardService } from '../../core/services/dashboard.service';
import {
  DashboardResumo,
  DashboardReceita,
  DashboardInadimplencia,
  DashboardContratosVencer,
} from '../../core/models/dashboard.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CurrencyPipe,
    DatePipe,
    NgClass,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  private readonly router = inject(Router);

  readonly loading = signal(true);
  readonly resumo = signal<DashboardResumo | null>(null);
  readonly receita = signal<DashboardReceita | null>(null);
  readonly inadimplencia = signal<DashboardInadimplencia | null>(null);
  readonly contratosVencer = signal<DashboardContratosVencer | null>(null);

  readonly receitaPercent = computed(() => {
    const r = this.receita();
    if (!r || r.receitaPrevista === 0) return 0;
    return Math.min(100, Math.round((r.receitaRealizada / r.receitaPrevista) * 100));
  });

  readonly mesNome = computed(() => {
    const r = this.receita();
    if (!r) return '';
    return new Date(r.ano, r.mes - 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  });

  ngOnInit(): void {
    this.carregarDados();
  }

  private carregarDados(): void {
    this.loading.set(true);
    let count = 0;
    const done = () => { if (++count === 4) this.loading.set(false); };

    this.dashboardService.resumo().subscribe({ next: (d) => { this.resumo.set(d); done(); }, error: done });
    this.dashboardService.receita().subscribe({ next: (d) => { this.receita.set(d); done(); }, error: done });
    this.dashboardService.inadimplencia().subscribe({ next: (d) => { this.inadimplencia.set(d); done(); }, error: done });
    this.dashboardService.contratosVencer().subscribe({ next: (d) => { this.contratosVencer.set(d); done(); }, error: done });
  }

  irParaContrato(id: number): void {
    this.router.navigate(['/contratos', id]);
  }

  urgenciaClass(dias: number): string {
    if (dias <= 7) return 'urgente';
    if (dias <= 15) return 'atencao';
    return 'normal';
  }
}