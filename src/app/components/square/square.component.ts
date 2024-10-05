import { AsyncPipe, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  HostListener,
  input,
  Output,
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
  disabled = input<boolean>(false);
  selected = input<boolean>(false);
  index = input<number>(0);
  value = input<SelectionType>(null);

  @Output() mark = new EventEmitter<number>();

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
