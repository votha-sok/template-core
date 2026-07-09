import { TemplateRef } from '@angular/core';

export type SortDirection = 'asc' | 'desc' | null;

export interface TableColumn<T = Record<string, unknown>> {
  /** Unique key — also used as the data accessor when `accessor` is absent. */
  key: string;
  /** Column header label. */
  header: string;
  /** Data accessor. Defaults to `row[key]`. */
  accessor?: (row: T) => unknown;
  /** Optional cell template (passed as TemplateRef). */
  cellTemplate?: TemplateRef<{ $implicit: T; value: unknown }>;
  /** Enable sorting for this column. Default: false. */
  sortable?: boolean;
  /** Column width CSS value (e.g. '120px', '1fr'). */
  width?: string;
  /** Text alignment. Default: 'left'. */
  align?: 'left' | 'center' | 'right';
  /** When true, the cell is sticky to the left edge. */
  sticky?: boolean;
}

export interface SortState {
  column: string | null;
  direction: SortDirection;
}

export interface TableState {
  sort: SortState;
  page: number;
  pageSize: number;
  total: number;
}
