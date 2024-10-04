import { AsyncPipe, NgClass } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { CoreService } from '@services/core/core.service';
import {
  CONSTANTS_TOKEN,
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
            'player-turn': checkPlayerTurn(this.CONSTANTS.players.X)
          }"
        >
          PlayerX
        </p>
        <p>
          <span>{{ playerXWinsCounter }}</span>
          vs
          <span>{{ playerOWinsCounter }}</span>
        </p>
        <p
          [ngClass]="{
            'player-turn': checkPlayerTurn(this.CONSTANTS.players.O)
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
  playerXWinsCounter = 0;
  playerOWinsCounter = 0;
  isButtonDisabled = true;

  subscription!: Subscription;

  constructor(
    protected coreService: CoreService,
    @Inject(CONSTANTS_TOKEN) protected CONSTANTS: IConstants
  ) {}

  ngOnInit() {
    this.subscription = this.coreService.selections$.subscribe((selections) => {
      const isEverySquareEmpty = selections.every(
        (square) => square.value === null
      );
      this.isButtonDisabled = isEverySquareEmpty;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  checkPlayerTurn(player: Player) {
    return this.coreService.currentPlayer === player;
  }

  startMatch() {
    if (this.isButtonDisabled) return;
    this.coreService.resetSelections();
  }
}
