import { Component, input } from '@angular/core';
import { type SelectionType } from '@services/core/core.service';

@Component({
  selector: 'app-square',
  standalone: true,
  template: `
    <button type="button">
      <p>
        {{ value() || '-' }}
      </p>
    </button>
  `,
  styleUrl: './square.component.scss',
  host: {
    role: 'button',
  },
})
export class SquareComponent {
  value = input<SelectionType>(null);
}
