import { AsyncPipe, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AddClassPipe } from '@pipes/addClass.pipe';
import { HighlightPipe } from '@pipes/highlight.pipe';
import { CoreService } from '@services/core/core.service';
import {
  CONSTANTS_TOKEN,
  type IConstants,
  type Player,
} from '@utils/constants';
import { Destroyable } from '@utils/Destroyable';
import { map, tap } from 'rxjs';

@Component({
  selector: 'app-match-manager',
  standalone: true,
  template: `
    <nav>
      <div>
        <p
          [ngClass]="shouldHighlightPlayer(this.CONSTANTS.player.X) | highlight"
        >
          PlayerX
        </p>
        <p [ngClass]="gameState().haveWinner | highlight">
          <span>{{ gameState().playerScore.X }}</span>
          vs
          <span>{{ gameState().playerScore.O }}</span>
        </p>
        <p
          [ngClass]="shouldHighlightPlayer(this.CONSTANTS.player.O) | highlight"
        >
          PlayerO
        </p>
      </div>
      <button
        [ngClass]="gameState().areAllSquaresEmpty | addClass : 'disabled'"
        (click)="restartMatch()"
        type="button"
      >
        RESTART
      </button>
    </nav>
  `,
  styleUrl: './match-manager.component.scss',
  imports: [NgClass, AsyncPipe, AddClassPipe, HighlightPipe],
  changeDetection: ChangeDetectionStrategy.Default, // using default due to constant turn changing
})
export class MatchManagerComponent extends Destroyable implements OnInit {
  protected gameState = signal({
    areAllSquaresEmpty: true,
    haveWinner: false,
    playerScore: {
      O: 0,
      X: 0,
    },
  });

  constructor(
    @Inject(CONSTANTS_TOKEN) protected CONSTANTS: IConstants,
    private coreService: CoreService
  ) {
    super();
  }

  ngOnInit() {
    this.coreService.gameState$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        map(([selections, winner]) => {
          const areAllSquaresEmpty = selections.every(
            (square) => square.value === null
          );

          const haveWinner = Boolean(winner);

          const playerScore = this.gameState().playerScore;
          if (haveWinner) {
            playerScore[winner!.player]++;
          }

          return { areAllSquaresEmpty, haveWinner, playerScore };
        }),
        tap(({ areAllSquaresEmpty, haveWinner, playerScore }) => {
          this.gameState.set({ areAllSquaresEmpty, haveWinner, playerScore });
        })
      )
      .subscribe();
  }

  shouldHighlightPlayer(player: Player): boolean {
    const isCurrentPlayerTurn = this.coreService.currentPlayer() === player;
    return isCurrentPlayerTurn && !this.gameState().haveWinner;
  }

  restartMatch() {
    if (this.gameState().areAllSquaresEmpty) return;
    this.coreService.resetSelections();
  }
}
