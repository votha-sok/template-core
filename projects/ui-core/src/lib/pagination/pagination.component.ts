import {
  ChangeDetectionStrategy, Component, computed, input, output,
} from '@angular/core';
import { CuiIconComponent } from 'ui-icons';

export interface PageEvent {
  page: number;
  pageSize: number;
  total: number;
}

@Component({
  selector: 'cui-pagination',
  standalone: true,
  imports: [CuiIconComponent],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'role': 'navigation',
    'aria-label': 'Pagination',
  },
})
export class CuiPaginationComponent {
  readonly page      = input<number>(1);
  readonly pageSize  = input<number>(10);
  readonly total     = input<number>(0);
  readonly pageSizes = input<number[]>([10, 25, 50, 100]);
  readonly showPageSizeSelector = input<boolean>(true);
  readonly showFirstLast        = input<boolean>(true);
  readonly compact              = input<boolean>(false);

  readonly pageChange = output<PageEvent>();

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.total() / this.pageSize()))
  );

  readonly startItem = computed(() =>
    this.total() === 0 ? 0 : (this.page() - 1) * this.pageSize() + 1
  );

  readonly endItem = computed(() =>
    Math.min(this.page() * this.pageSize(), this.total())
  );

  /** Build a window of page numbers to display, with ellipsis gaps. */
  readonly pageNumbers = computed<(number | '...')[]>(() => {
    const total = this.totalPages();
    const current = this.page();
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const pages: (number | '...')[] = [1];
    if (current > 3) pages.push('...');
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
      pages.push(i);
    }
    if (current < total - 2) pages.push('...');
    pages.push(total);
    return pages;
  });

  goTo(page: number | '...'): void {
    if (page === '...' || page === this.page()) return;
    this.emit(page);
  }

  prev(): void { if (this.page() > 1) this.emit(this.page() - 1); }
  next(): void { if (this.page() < this.totalPages()) this.emit(this.page() + 1); }
  first(): void { if (this.page() !== 1) this.emit(1); }
  last(): void { if (this.page() !== this.totalPages()) this.emit(this.totalPages()); }

  onPageSizeChange(e: Event): void {
    const size = Number((e.target as HTMLSelectElement).value);
    this.pageChange.emit({ page: 1, pageSize: size, total: this.total() });
  }

  private emit(page: number): void {
    this.pageChange.emit({ page, pageSize: this.pageSize(), total: this.total() });
  }
}
