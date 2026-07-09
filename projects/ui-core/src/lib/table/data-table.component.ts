import {
  ChangeDetectionStrategy, Component, computed,
  input, output, signal,
} from '@angular/core';
import { CuiTableComponent } from '../table/table.component';
import { CuiPaginationComponent, PageEvent } from '../pagination/pagination.component';
import { CuiInputComponent } from '../input/input.component';
import { TableColumn, SortState, TableState } from '../table/table.types';

export interface DataTableChangeEvent {
  sort: SortState;
  page: number;
  pageSize: number;
  search: string;
}

@Component({
  selector: 'cui-data-table',
  standalone: true,
  imports: [CuiTableComponent, CuiPaginationComponent, CuiInputComponent],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CuiDataTableComponent<T extends Record<string, unknown> = Record<string, unknown>> {
  // ── Inputs ─────────────────────────────────────────────────────────────────
  readonly columns    = input<TableColumn<T>[]>([]);
  readonly rows       = input<T[]>([]);
  readonly total      = input<number>(0);
  readonly loading    = input<boolean>(false);
  readonly selectable = input<boolean>(false);
  readonly striped    = input<boolean>(false);
  readonly searchable = input<boolean>(true);
  readonly searchPlaceholder = input<string>('Search…');
  readonly pageSizes  = input<number[]>([10, 25, 50]);
  readonly trackBy    = input<(row: T) => unknown>((row) => row);

  // ── Outputs ────────────────────────────────────────────────────────────────
  readonly stateChange     = output<DataTableChangeEvent>();
  readonly selectionChange = output<T[]>();
  readonly rowClick        = output<T>();

  // ── Internal ───────────────────────────────────────────────────────────────
  readonly _page     = signal(1);
  readonly _pageSize = signal(10);
  readonly _sort     = signal<SortState>({ column: null, direction: null });
  readonly _search   = signal('');

  private searchDebounce: ReturnType<typeof setTimeout> | null = null;

  onSortChange(sort: SortState): void {
    this._sort.set(sort);
    this._page.set(1);
    this.emit();
  }

  onPageChange(e: PageEvent): void {
    this._page.set(e.page);
    this._pageSize.set(e.pageSize);
    this.emit();
  }

  onSearch(value: string): void {
    if (this.searchDebounce) clearTimeout(this.searchDebounce);
    this.searchDebounce = setTimeout(() => {
      this._search.set(value);
      this._page.set(1);
      this.emit();
    }, 300);
  }

  private emit(): void {
    this.stateChange.emit({
      sort: this._sort(),
      page: this._page(),
      pageSize: this._pageSize(),
      search: this._search(),
    });
  }
}
