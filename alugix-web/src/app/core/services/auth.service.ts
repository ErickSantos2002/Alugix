import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  // BehaviorSubject: guarda o estado de autenticação em tempo real.
  // Qualquer componente pode "escutar" mudanças (ex: mostrar/esconder menu).
  private readonly _isAuthenticated$ = new BehaviorSubject<boolean>(this.hasToken());

  readonly isAuthenticated$ = this._isAuthenticated$.asObservable();

  // ─── Login ────────────────────────────────────────────────────────────────
  // Chama POST /api/v1/auth/login e salva o token no localStorage.
  // O operador `tap` executa um efeito colateral sem modificar o dado retornado.
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/api/v1/auth/login', credentials).pipe(
      tap((response) => this.saveSession(response))
    );
  }

  // ─── Logout ───────────────────────────────────────────────────────────────
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('nome');
    localStorage.removeItem('perfil');
    this._isAuthenticated$.next(false);
    this.router.navigate(['/login']);
  }

  // ─── Getters ──────────────────────────────────────────────────────────────
  isAuthenticated(): boolean {
    return this.hasToken();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRole(): 'ADMIN' | 'USUARIO' | null {
    const raw = localStorage.getItem('perfil');
    if (raw === 'ADMIN' || raw === 'USUARIO') return raw;
    return null;
  }

  isAdmin(): boolean {
    return this.getRole() === 'ADMIN';
  }

  getUserName(): string | null {
    return localStorage.getItem('nome');
  }

  // ─── Privados ─────────────────────────────────────────────────────────────
  private saveSession(response: LoginResponse): void {
    localStorage.setItem('token', response.token);
    localStorage.setItem('nome', response.nome);
    localStorage.setItem('perfil', response.perfil);
    this._isAuthenticated$.next(true);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }
}
