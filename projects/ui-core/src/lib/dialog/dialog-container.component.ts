import {
  ChangeDetectionStrategy, Component, inject, input, output,
} from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import { CuiIconComponent } from 'ui-icons';
import { CuiButtonComponent } from '../button/button.component';

/**
 * Shell component that wraps a dialog's content with a consistent
 * header (title + close button), scrollable body, and footer (action buttons).
 *
 * Used by DialogService internally, and also usable standalone when
 * composing custom dialog components.
 *
 * ## Usage inside a dialog component
 * ```html
 * <cui-dialog-container title="Confirm Delete">
 *   <p>Are you sure you want to delete this record?</p>
 *   <div cuiDialogFooter>
 *     <cui-button variant="text" (cuiClick)="close()">Cancel</cui-button>
 *     <cui-button color="error"  (cuiClick)="confirm()">Delete</cui-button>
 *   </div>
 * </cui-dialog-container>
 * ```
 */
@Component({
  selector: 'cui-dialog-container',
  standalone: true,
  imports: [CuiIconComponent, CuiButtonComponent],
  templateUrl: './dialog-container.component.html',
  styleUrl: './dialog-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CuiDialogContainerComponent {
  private readonly dialogRef = inject(DialogRef, { optional: true });

  readonly title       = input<string>('');
  readonly showClose   = input<boolean>(true);
  readonly dividers    = input<boolean>(true);

  readonly closed = output<void>();

  close(): void {
    this.closed.emit();
    this.dialogRef?.close();
  }
}
