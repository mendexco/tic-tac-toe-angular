import { AsyncPipe, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  HostListener,
  input,
  output
} from '@angular/core';
import { type SelectionType } from '@services/core/core.service';

@Component({
  selector: 'app-square',
  standalone: true,
  template: `<p>{{ value() || '-' }}</p>`,
  styleUrl: './square.component.scss',
  imports: [NgClass, AsyncPipe],
  host: { role: 'button' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SquareComponent {
  public disabled = input<boolean>(false);
  public selected = input<boolean>(false);
  public index = input<number>(0);
  public value = input<SelectionType>(null);

  public mark = output<number>();

  @HostBinding('class')
  get classes(): Record<string, boolean> {
    return {
      disabled: this.disabled(),
      selected: this.selected(),
    };
  }

  @HostListener('click')
  handleMark() {
    if (this.disabled() || this.value()) return;
    this.mark.emit(this.index());
  }
}
