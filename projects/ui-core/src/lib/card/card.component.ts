import {
  ChangeDetectionStrategy, Component, computed, input,
} from '@angular/core';

export type CardVariant = 'elevated' | 'outlined' | 'filled';

@Component({
  selector: 'cui-card',
  standalone: true,
  template: `
    <ng-content select="[cuiCardHeader]" />
    <ng-content select="cui-card-header" />
    <ng-content />
    <ng-content select="[cuiCardFooter]" />
  `,
  styleUrl: './card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass()',
  },
})
export class CuiCardComponent {
  readonly variant   = input<CardVariant>('elevated');
  readonly padding   = input<boolean>(true);
  readonly hoverable = input<boolean>(false);
  readonly selected  = input<boolean>(false);
  readonly clickable = input<boolean>(false);

  readonly hostClass = computed(() => [
    'cui-card',
    `cui-card--${this.variant()}`,
    this.hoverable() ? 'cui-card--hoverable' : '',
    this.selected()  ? 'cui-card--selected'  : '',
    this.clickable() ? 'cui-card--clickable' : '',
    this.padding()   ? 'cui-card--padded'    : '',
  ].filter(Boolean).join(' '));
}
