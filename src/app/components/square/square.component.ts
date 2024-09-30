import { Component, input } from '@angular/core';
import { type SelectionType } from '@services/core.service';

@Component({
  selector: 'app-square',
  standalone: true,
  template: `
    <div>
      <p>
        {{ value() || 'A' }}
      </p>
    </div>
  `,
  styleUrl: './square.component.scss',
})
export class SquareComponent {
  value = input<SelectionType>(null);
}
