import { AsyncPipe, NgClass } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { CoreService, type WinnerData } from '@services/core/core.service';
import {
  CONSTANTS_TOKEN,
  Nullable,
  type IConstants,
  type Player,
} from '@utils/constants';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-match-manager',
  standalone: true,
  template: `
    <nav>
      <div>
        <p
          [ngClass]="{
            highlighted: shouldHighlightPlayer(this.CONSTANTS.players.X)
          }"
        >
          PlayerX
        </p>
        <p [ngClass]="{ highlighted: shouldHighlightScore() }">
          <span>{{ playerWins.X }}</span>
          vs
          <span>{{ playerWins.O }}</span>
        </p>
        <p
          [ngClass]="{
            highlighted: shouldHighlightPlayer(this.CONSTANTS.players.O)
          }"
        >
          PlayerO
        </p>
      </div>
      <button
        (click)="startMatch()"
        [ngClass]="{ disabled: this.isButtonDisabled }"
        type="button"
      >
        RESTART
      </button>
    </nav>
  `,
  styleUrl: './match-manager.component.scss',
  imports: [NgClass, AsyncPipe],
})
export class MatchManagerComponent implements OnInit, OnDestroy {
  playerWins = {
    O: 0,
    X: 0,
  };
  isButtonDisabled = true;
  winnerPlayer: Nullable<WinnerData> = null;

  selectionsSubscription!: Subscription;
  winnerSubscription!: Subscription;

  constructor(
    protected coreService: CoreService,
    @Inject(CONSTANTS_TOKEN) protected CONSTANTS: IConstants
  ) {}

  ngOnInit() {
    this.selectionsSubscription = this.coreService.selections$.subscribe(
      (selections) => {
        const isEverySquareEmpty = selections.every(
          (square) => square.value === null
        );
        this.isButtonDisabled = isEverySquareEmpty;
      }
    );

    this.winnerSubscription = this.coreService.winner$.subscribe((winner) => {
      const winnerMark = winner?.player;
      if (this.winnerPlayer === null && Boolean(winnerMark)) {
        this.playerWins[winnerMark!]++;
      }

      this.winnerPlayer = winner;
    });
  }

  ngOnDestroy() {
    this.selectionsSubscription.unsubscribe();
    this.winnerSubscription.unsubscribe();
  }

  shouldHighlightPlayer(player: Player): boolean {
    const isCurrentPlayerTurn = this.coreService.currentPlayer === player;
    const haveNoWinner = this.winnerPlayer === null;
    return isCurrentPlayerTurn && haveNoWinner;
  }

  shouldHighlightScore(): boolean {
    const haveWinner = this.winnerPlayer !== null;
    return haveWinner;
  }

  startMatch() {
    if (this.isButtonDisabled) return;
    this.coreService.resetSelections();
  }
}
