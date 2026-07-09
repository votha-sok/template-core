import {
  ChangeDetectionStrategy, Component, computed,
  forwardRef, input, model, output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

export type DatepickerVariant = 'outline' | 'fill';

@Component({
  selector: 'cui-datepicker',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './datepicker.component.html',
  styleUrl: './datepicker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CuiDatepickerComponent),
    multi: true,
  }],
})
export class CuiDatepickerComponent implements ControlValueAccessor {
  readonly label       = input<string>('');
  readonly placeholder = input<string>('MM/DD/YYYY');
  readonly hint        = input<string | null>(null);
  readonly error       = input<string | null>(null);
  readonly variant     = input<DatepickerVariant>('outline');
  readonly disabled    = input<boolean>(false);
  readonly required    = input<boolean>(false);
  readonly fullWidth   = input<boolean>(true);
  readonly min         = input<Date | null>(null);
  readonly max         = input<Date | null>(null);

  readonly value    = model<Date | null>(null);
  readonly cuiChange = output<Date | null>();

  private _onChange: (v: Date | null) => void = () => {};
  private _onTouched: () => void = () => {};

  readonly matAppearance = computed(() =>
    this.variant() === 'fill' ? 'fill' as const : 'outline' as const
  );

  readonly hasError = computed(() => !!this.error());

  onDateChange(v: Date | null): void {
    this.value.set(v);
    this._onChange(v);
    this.cuiChange.emit(v);
  }

  onBlur(): void { this._onTouched(); }

  writeValue(v: Date | null): void    { this.value.set(v); }
  registerOnChange(fn: (v: Date | null) => void): void { this._onChange = fn; }
  registerOnTouched(fn: () => void): void { this._onTouched = fn; }
  setDisabledState(_: boolean): void  { }
}
