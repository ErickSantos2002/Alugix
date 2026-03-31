import { Component, Input, Output, EventEmitter, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface PaginationEvent {
  pageIndex: number;
  pageSize: number;
}

function getVisiblePages(current: number, total: number): number[] {
  const half = 2;
  let start = Math.max(1, current - half);
  let end = start + 4;
  if (end > total) {
    end = total;
    start = Math.max(1, end - 4);
  }
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
})
export class PaginationComponent {
  @Input() totalElements = 0;
  @Input() pageSize = 10;
  @Input() pageIndex = 0;
  @Input() itemLabel = 'registros';
  @Output() pageChange = new EventEmitter<PaginationEvent>();

  get totalPages(): number {
    return Math.ceil(this.totalElements / this.pageSize) || 1;
  }

  get currentPage(): number {
    return this.pageIndex + 1;
  }

  get startItem(): number {
    return this.totalElements === 0 ? 0 : this.pageIndex * this.pageSize + 1;
  }

  get endItem(): number {
    return Math.min((this.pageIndex + 1) * this.pageSize, this.totalElements);
  }

  get visiblePages(): number[] {
    return getVisiblePages(this.currentPage, this.totalPages);
  }

  get hasPrev(): boolean {
    return this.pageIndex > 0;
  }

  get hasNext(): boolean {
    return this.pageIndex < this.totalPages - 1;
  }

  goTo(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.pageChange.emit({ pageIndex: page - 1, pageSize: this.pageSize });
  }

  prev(): void {
    if (this.hasPrev) this.goTo(this.currentPage - 1);
  }

  next(): void {
    if (this.hasNext) this.goTo(this.currentPage + 1);
  }
}
