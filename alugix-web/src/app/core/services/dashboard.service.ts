import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  DashboardResumo,
  DashboardReceita,
  DashboardInadimplencia,
  DashboardContratosVencer,
} from '../models/dashboard.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly base = '/api/v1/dashboard';

  resumo(): Observable<DashboardResumo> {
    return this.http.get<DashboardResumo>(`${this.base}/resumo`);
  }

  receita(): Observable<DashboardReceita> {
    return this.http.get<DashboardReceita>(`${this.base}/receita`);
  }

  inadimplencia(): Observable<DashboardInadimplencia> {
    return this.http.get<DashboardInadimplencia>(`${this.base}/inadimplencia`);
  }

  contratosVencer(dias = 30): Observable<DashboardContratosVencer> {
    return this.http.get<DashboardContratosVencer>(`${this.base}/contratos-vencer?dias=${dias}`);
  }
}