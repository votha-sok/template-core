import {
  ChangeDetectionStrategy, Component, computed, inject, input,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { BreadcrumbService } from 'ui-utils';
import { CuiIconComponent } from 'ui-icons';

export interface BreadcrumbItem {
  label: string;
  routerLink?: string;
  isCurrent?: boolean;
}

@Component({
  selector: 'cui-breadcrumb',
  standalone: true,
  imports: [RouterLink, CuiIconComponent],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'role': 'navigation',
    'aria-label': 'Breadcrumb',
  },
})
export class CuiBreadcrumbComponent {
  private readonly breadcrumbService = inject(BreadcrumbService);

  /**
   * Manual items. When provided, overrides the BreadcrumbService signal.
   * When omitted, the service's current breadcrumbs are used automatically.
   */
  readonly items = input<BreadcrumbItem[] | null>(null);
  readonly separator = input<string>('chevron_right');

  readonly resolved = computed<BreadcrumbItem[]>(() =>
    this.items() ?? (this.breadcrumbService.breadcrumbs() as BreadcrumbItem[])
  );
}
