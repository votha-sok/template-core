import {
  ChangeDetectionStrategy, Component, computed,
  input, output, signal,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { CuiIconComponent } from 'ui-icons';
import { TableColumn, SortDirection, SortState } from './table.types';

@Component({
  selector: 'cui-table',
  standalone: true,
  imports: [NgTemplateOutlet, CuiIconComponent],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CuiTableComponent<T extends Record<string, unknown> = Record<string, unknown>> {
  // ── Inputs ─────────────────────────────────────────────────────────────────
  readonly columns    = input<TableColumn<T>[]>([]);
  readonly rows       = input<T[]>([]);
  readonly loading    = input<boolean>(false);
  readonly selectable = input<boolean>(false);
  readonly striped    = input<boolean>(false);
  readonly hoverable  = input<boolean>(true);
  readonly stickyHeader = input<boolean>(true);
  readonly trackBy    = input<(row: T) => unknown>((row) => row);

  // ── Outputs ────────────────────────────────────────────────────────────────
  readonly sortChange      = output<SortState>();
  readonly selectionChange = output<T[]>();
  readonly rowClick        = output<T>();

  // ── Internal state ─────────────────────────────────────────────────────────
  readonly _sort     = signal<SortState>({ column: null, direction: null });
  readonly _selected = signal<Set<unknown>>(new Set());

  readonly allSelected = computed(() => {
    const rows = this.rows();
    if (!rows.length) return false;
    const sel = this._selected();
    return rows.every(r => sel.has(this.trackBy()(r)));
  });

  // ── Methods ────────────────────────────────────────────────────────────────
  getValue(row: T, col: TableColumn<T>): unknown {
    return col.accessor ? col.accessor(row) : row[col.key];
  }

  onSort(col: TableColumn<T>): void {
    if (!col.sortable) return;
    const cur = this._sort();
    let next: SortDirection = 'asc';
    if (cur.column === col.key) {
      next = cur.direction === 'asc' ? 'desc' : cur.direction === 'desc' ? null : 'asc';
    }
    const state: SortState = { column: next ? col.key : null, direction: next };
    this._sort.set(state);
    this.sortChange.emit(state);
  }

  getSortIcon(col: TableColumn<T>): string {
    const s = this._sort();
    if (s.column !== col.key || !s.direction) return 'unfold_more';
    return s.direction === 'asc' ? 'arrow_upward' : 'arrow_downward';
  }

  toggleAll(): void {
    const sel = new Set(this._selected());
    if (this.allSelected()) {
      this.rows().forEach(r => sel.delete(this.trackBy()(r)));
    } else {
      this.rows().forEach(r => sel.add(this.trackBy()(r)));
    }
    this._selected.set(sel);
    this.emitSelection();
  }

  toggleRow(row: T): void {
    const key = this.trackBy()(row);
    const sel = new Set(this._selected());
    sel.has(key) ? sel.delete(key) : sel.add(key);
    this._selected.set(sel);
    this.emitSelection();
  }

  isSelected(row: T): boolean {
    return this._selected().has(this.trackBy()(row));
  }

  private emitSelection(): void {
    const sel = this._selected();
    this.selectionChange.emit(this.rows().filter(r => sel.has(this.trackBy()(r))));
  }
}
