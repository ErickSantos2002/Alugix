import { Component, OnInit, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { HealthService } from './core/services/health.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatProgressSpinnerModule, MatIconModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private readonly healthService = inject(HealthService);

  status = signal<'loading' | 'online' | 'offline'>('loading');

  ngOnInit(): void {
    this.healthService.check().subscribe({
      next: () => this.status.set('online'),
      error: () => this.status.set('offline'),
    });
  }
}
