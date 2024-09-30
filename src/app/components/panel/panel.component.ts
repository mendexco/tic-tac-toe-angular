import { Component } from '@angular/core';
import { SquareComponent } from '@components/square/square.component';
import { CoreService, type SelectionType } from '@services/core.service';

type SquareType = {
  id: number;
  value: SelectionType;
};

@Component({
  selector: 'app-panel',
  standalone: true,
  template: `
    @for (square of squares; track square.id) {
    <app-square [value]="square.value" />
    }
  `,
  styleUrl: './panel.component.scss',
  providers: [CoreService],
  imports: [SquareComponent],
})
export class PanelComponent {
  squares: SquareType[] = Array(9)
    .fill(null)
    .map((_, index) => ({
      id: index + 1,
      value: null,
    }));

  constructor(private coreServices: CoreService) {}
}
