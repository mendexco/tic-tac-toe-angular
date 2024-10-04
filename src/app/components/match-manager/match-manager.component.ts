import { AsyncPipe, NgClass } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CoreService } from '@services/core/core.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-match-manager',
  standalone: true,
  template: `
    <nav>
      <div>
        <p
          [ngClass]="{
            'player-turn': this.coreService.currentPlayer === 'X'
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
            'player-turn': this.coreService.currentPlayer === 'O'
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

  constructor(protected coreService: CoreService) {}

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

  startMatch() {
    if (this.isButtonDisabled) return;
    this.coreService.resetSelections();
  }
}
