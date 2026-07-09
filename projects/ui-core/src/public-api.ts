/*
 * Public API Surface of ui-core
 * This is the ONLY file other projects may import from.
 */

// ── Wave 1: Atoms ─────────────────────────────────────────────────────────────
export * from './lib/button/button.component';
export * from './lib/badge/badge.component';
export * from './lib/avatar/avatar.component';
export * from './lib/spinner/spinner.component';
export * from './lib/skeleton/skeleton.component';
export * from './lib/progress/progress.component';
export * from './lib/chip/chip.component';
export * from './lib/tooltip/tooltip.directive';

// ── Wave 2: Feedback ──────────────────────────────────────────────────────────
export * from './lib/toast/toast-outlet.component';
export * from './lib/loading-overlay/loading-overlay.component';
export * from './lib/empty-state/empty-state.component';

// ── Wave 3: Forms ─────────────────────────────────────────────────────────────
export * from './lib/input/input.component';
export * from './lib/select/select.component';
export * from './lib/datepicker/datepicker.component';

// ── Wave 3: Layout & Navigation ───────────────────────────────────────────────
export * from './lib/card/card.component';
export * from './lib/breadcrumb/breadcrumb.component';
export * from './lib/tabs/tabs.component';
export * from './lib/pagination/pagination.component';

// ── Wave 3: Overlays ──────────────────────────────────────────────────────────
export * from './lib/dialog/dialog-container.component';
export * from './lib/drawer/drawer.component';

// ── Wave 3: Data ──────────────────────────────────────────────────────────────
export * from './lib/table/table.types';
export * from './lib/table/table.component';
export * from './lib/table/data-table.component';
