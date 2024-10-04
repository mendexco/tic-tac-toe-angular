import { NgClass } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostListener,
  input,
  Output,
} from '@angular/core';
import { type SelectionType } from '@services/core/core.service';

@Component({
  selector: 'app-square',
  standalone: true,
  template: `
    <button [ngClass]="{ disabled: !!value() }" type="button">
      <p>
        {{ value() || '-' }}
      </p>
    </button>
  `,
  styleUrl: './square.component.scss',
  imports: [NgClass],
  host: {
    role: 'button',
  },
})
export class SquareComponent {
  value = input<SelectionType>(null);
  @Output() mark = new EventEmitter<void>();

  @HostListener('click')
  handleMark() {
    if (this.value()) return;
    this.mark.emit();
  }
}
