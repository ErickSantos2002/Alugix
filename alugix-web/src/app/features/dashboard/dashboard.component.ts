import { Component, OnInit, NgZone, inject, signal, computed } from '@angular/core';
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
  private readonly zone = inject(NgZone);

  readonly loading = signal(true);
  readonly resumo = signal<DashboardResumo | null>(null);

  readonly animTotalImoveis = signal(0);
  readonly animTotalInquilinos = signal(0);
  readonly animTotalContratos = signal(0);
  readonly animTotalAtrasados = signal(0);

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

  private countUp(target: number, setter: (v: number) => void, duration = 1200): void {
    if (target === 0) { setter(0); return; }
    const start = performance.now();
    this.zone.runOutsideAngular(() => {
      const step = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        this.zone.run(() => setter(Math.round(target * eased)));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }

  private carregarDados(): void {
    this.loading.set(true);
    let count = 0;
    const done = () => { if (++count === 4) this.loading.set(false); };

    this.dashboardService.resumo().subscribe({
      next: (d) => {
        this.resumo.set(d);
        this.countUp(d.totalImoveis, v => this.animTotalImoveis.set(v));
        this.countUp(d.totalInquilinos, v => this.animTotalInquilinos.set(v));
        this.countUp(d.totalContratosAtivos, v => this.animTotalContratos.set(v));
        this.countUp(d.totalPagamentosAtrasados, v => this.animTotalAtrasados.set(v));
        done();
      },
      error: done
    });
    this.dashboardService.receita().subscribe({ next: d => { this.receita.set(d); done(); }, error: done });
    this.dashboardService.inadimplencia().subscribe({ next: d => { this.inadimplencia.set(d); done(); }, error: done });
    this.dashboardService.contratosVencer().subscribe({ next: d => { this.contratosVencer.set(d); done(); }, error: done });
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
