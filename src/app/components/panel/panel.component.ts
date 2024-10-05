import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { SquareComponent } from '@components/square/square.component';
import {
  CoreService,
  SquareType,
  WinnerData,
} from '@services/core/core.service';
import { Nullable } from '@utils/constants';
import { tap, type Subscription } from 'rxjs';

@Component({
  selector: 'app-panel',
  standalone: true,
  template: `
    @for (square of this.coreServices.selections$ | async; track square.index;)
    {
    <app-square
      (mark)="handleSelectSquare($event)"
      [disabled]="checkIsDisabled(square.index)"
      [selected]="checkIsSelected(square)"
      [index]="square.index"
      [value]="square.value"
    />
    }
  `,
  styleUrl: './panel.component.scss',
  imports: [AsyncPipe, SquareComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PanelComponent implements OnInit, OnDestroy {
  winner: Nullable<WinnerData> = null;

  winnerSubscription!: Subscription;

  constructor(protected coreServices: CoreService) {}

  ngOnInit() {
    this.winnerSubscription = this.coreServices.winner$
      .pipe(tap((winner) => (this.winner = winner)))
      .subscribe();
  }

  ngOnDestroy() {
    this.winnerSubscription.unsubscribe();
  }

  checkIsDisabled(index: number): boolean {
    const isVictoriousSquare =
      this.winner?.combination.includes(index) ?? false;
    const haveWinner = Boolean(this.winner);

    return haveWinner && !isVictoriousSquare;
  }

  checkIsSelected(square: SquareType): boolean {
    const isVictoriousSquare =
      this.winner?.combination.includes(square.index) ?? false;
    const hasValueSelected = Boolean(square.value);

    return (
      isVictoriousSquare ||
      (hasValueSelected && !this.checkIsDisabled(square.index))
    );
  }

  handleSelectSquare(squareIndex: number): void {
    this.coreServices.markSquare(squareIndex);
    this.coreServices.checkVictory();
    this.coreServices.switchPlayer();
  }
}
