import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly THEME_KEY = 'alugix-theme';

  isDark = signal<boolean>(this.loadTheme());

  private loadTheme(): boolean {
    return localStorage.getItem(this.THEME_KEY) === 'dark';
  }

  toggle(): void {
    const next = !this.isDark();
    this.isDark.set(next);
    localStorage.setItem(this.THEME_KEY, next ? 'dark' : 'light');
    document.body.classList.toggle('dark-theme', next);
  }

  apply(): void {
    document.body.classList.toggle('dark-theme', this.isDark());
  }
}
