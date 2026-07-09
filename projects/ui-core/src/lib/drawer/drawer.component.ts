import {
  ChangeDetectionStrategy, Component, computed,
  input, output,
} from '@angular/core';
import { CuiIconComponent } from 'ui-icons';

export type DrawerPosition = 'left' | 'right' | 'top' | 'bottom';
export type DrawerSize     = 'sm' | 'md' | 'lg' | 'full';

const SIZE_MAP: Record<DrawerSize, string> = {
  sm:   '320px',
  md:   '480px',
  lg:   '640px',
  full: '100%',
};

@Component({
  selector: 'cui-drawer',
  standalone: true,
  imports: [CuiIconComponent],
  templateUrl: './drawer.component.html',
  styleUrl: './drawer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CuiDrawerComponent {
  readonly open      = input<boolean>(false);
  readonly title     = input<string>('');
  readonly position  = input<DrawerPosition>('right');
  readonly size      = input<DrawerSize>('md');
  readonly showClose = input<boolean>(true);
  readonly closeOnBackdrop = input<boolean>(true);

  readonly closed = output<void>();

  readonly panelWidth = computed(() => {
    const pos = this.position();
    return pos === 'left' || pos === 'right' ? SIZE_MAP[this.size()] : '100%';
  });

  readonly panelHeight = computed(() => {
    const pos = this.position();
    return pos === 'top' || pos === 'bottom' ? SIZE_MAP[this.size()] : '100%';
  });

  close(): void { this.closed.emit(); }

  onBackdropClick(): void {
    if (this.closeOnBackdrop()) this.close();
  }
}
