import { AsyncPipe, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CoreService } from '@services/core/core.service';
import {
  CONSTANTS_TOKEN,
  type IConstants,
  type Player,
} from '@utils/constants';
import { map, Subscription, tap } from 'rxjs';

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
        <p [ngClass]="{ highlighted: gameState.haveWinner }">
          <span>{{ gameState.playersScores.X }}</span>
          vs
          <span>{{ gameState.playersScores.O }}</span>
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
        [ngClass]="{ disabled: gameState.areAllSquaresEmpty }"
        (click)="restartMatch()"
        type="button"
      >
        RESTART
      </button>
    </nav>
  `,
  styleUrl: './match-manager.component.scss',
  imports: [NgClass, AsyncPipe],
  changeDetection: ChangeDetectionStrategy.Default, // using default due to constant turn changing
})
export class MatchManagerComponent implements OnInit, OnDestroy {
  gameState = {
    areAllSquaresEmpty: true,
    haveWinner: false,
    playersScores: {
      O: 0,
      X: 0,
    },
  };

  gameStateSubscription!: Subscription;

  constructor(
    @Inject(CONSTANTS_TOKEN) protected CONSTANTS: IConstants,
    private coreService: CoreService
  ) {}

  ngOnInit() {
    this.gameStateSubscription = this.coreService.gameState$
      .pipe(
        map(([selections, winner]) => {
          const areAllSquaresEmpty = selections.every(
            (square) => square.value === null
          );

          const haveWinner = Boolean(winner);

          const playersScores = this.gameState.playersScores;
          if (haveWinner) {
            playersScores[winner!.player]++;
          }

          return { areAllSquaresEmpty, haveWinner, playersScores };
        }),
        tap(({ areAllSquaresEmpty, haveWinner, playersScores }) => {
          this.gameState = { areAllSquaresEmpty, haveWinner, playersScores };
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.gameStateSubscription.unsubscribe();
  }

  shouldHighlightPlayer(player: Player): boolean {
    const isCurrentPlayerTurn = this.coreService.currentPlayer === player;
    return isCurrentPlayerTurn && !this.gameState.haveWinner;
  }

  restartMatch() {
    if (this.gameState.areAllSquaresEmpty) return;
    this.coreService.resetSelections();
  }
}
