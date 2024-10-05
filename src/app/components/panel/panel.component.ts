import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { SquareComponent } from '@components/square/square.component';
import { CoreService } from '@services/core/core.service';

@Component({
  selector: 'app-panel',
  standalone: true,
  template: `
    @for (square of this.coreServices.selections$ | async; track square.index) {
    <app-square
      (mark)="handleSelectSquare($event)"
      [index]="square.index"
      [value]="square.value"
    />
    }
  `,
  styleUrl: './panel.component.scss',
  imports: [AsyncPipe, SquareComponent],
})
export class PanelComponent {
  constructor(protected coreServices: CoreService) {}

  handleSelectSquare(squareIndex: number): void {
    this.coreServices.markSquare(squareIndex);
    this.coreServices.switchPlayer();
  }
}
