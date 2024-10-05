import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { SquareComponent } from '@components/square/square.component';
import { FormatSquaresPipe } from '@pipes/formatSquares.pipe';
import { CoreService, WinnerData } from '@services/core/core.service';
import { Nullable } from '@utils/constants';
import { tap, type Subscription } from 'rxjs';

@Component({
  selector: 'app-panel',
  standalone: true,
  template: `
    @for (square of (this.coreServices.selections$ | formatSquares:
    this.winner); track square.index;) {
    <app-square
      (mark)="handleSelectSquare($event)"
      [disabled]="square.disabled"
      [selected]="square.selected"
      [index]="square.index"
      [value]="square.value"
    />
    }
  `,
  styleUrl: './panel.component.scss',
  imports: [AsyncPipe, FormatSquaresPipe, SquareComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PanelComponent implements OnInit, OnDestroy {
  winner: Nullable<WinnerData> = null;

  constructor(protected coreServices: CoreService) {}

  winnerSubscription!: Subscription;

  ngOnInit() {
    this.winnerSubscription = this.coreServices.winner$
      .pipe(tap((winner) => (this.winner = winner)))
      .subscribe();
  }

  ngOnDestroy() {
    this.winnerSubscription.unsubscribe();
  }

  handleSelectSquare(squareIndex: number): void {
    this.coreServices.markSquare(squareIndex);
    this.coreServices.checkVictory();
    this.coreServices.switchPlayer();
  }
}
