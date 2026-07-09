import {
  ChangeDetectionStrategy, Component, computed,
  forwardRef, input, model, output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

export interface SelectOption<T = string> {
  value: T;
  label: string;
  disabled?: boolean;
  group?: string;
}

@Component({
  selector: 'cui-select',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CuiSelectComponent),
    multi: true,
  }],
})
export class CuiSelectComponent<T = string> implements ControlValueAccessor {
  readonly label       = input<string>('');
  readonly options     = input<SelectOption<T>[]>([]);
  readonly placeholder = input<string>('Select…');
  readonly hint        = input<string | null>(null);
  readonly error       = input<string | null>(null);
  readonly multiple    = input<boolean>(false);
  readonly disabled    = input<boolean>(false);
  readonly required    = input<boolean>(false);
  readonly fullWidth   = input<boolean>(true);
  readonly variant     = input<'outline'|'fill'>('outline');

  readonly value = model<T | T[] | null>(null);
  readonly cuiChange = output<T | T[] | null>();

  private _onChange: (v: T | T[] | null) => void = () => {};
  private _onTouched: () => void = () => {};

  readonly matAppearance = computed(() =>
    this.variant() === 'fill' ? 'fill' as const : 'outline' as const
  );

  /** Group options by their `group` property. */
  readonly groupedOptions = computed(() => {
    const opts = this.options();
    const groups = new Map<string, SelectOption<T>[]>();
    const ungrouped: SelectOption<T>[] = [];
    for (const o of opts) {
      if (o.group) {
        const g = groups.get(o.group) ?? [];
        g.push(o);
        groups.set(o.group, g);
      } else {
        ungrouped.push(o);
      }
    }
    return { ungrouped, groups: Array.from(groups.entries()) };
  });

  onChange(v: T | T[] | null): void {
    this.value.set(v);
    this._onChange(v);
    this.cuiChange.emit(v);
  }

  writeValue(v: T | T[] | null): void     { this.value.set(v); }
  registerOnChange(fn: (v: T | T[] | null) => void): void { this._onChange = fn; }
  registerOnTouched(fn: () => void): void  { this._onTouched = fn; }
  setDisabledState(_: boolean): void       { }

  onTouched(): void { this._onTouched(); }
}
