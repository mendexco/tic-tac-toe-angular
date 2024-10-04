import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

export type SelectionType = 'X' | 'O' | null;

export type SquareType = {
  index: number;
  value: SelectionType;
};

const INITIAL_PLAYER: Exclude<SelectionType, null> =
  Math.floor(Math.random() * 2) + 1 === 1 ? 'X' : 'O';

const INITIAL_SELECTIONS = Array.from({ length: 9 }, (_, index) => ({
  index,
  value: null,
}));

@Injectable({
  providedIn: 'root',
})
export class CoreService {
  currentPlayer = INITIAL_PLAYER;
  private selections = new BehaviorSubject<SquareType[]>(INITIAL_SELECTIONS);
  selections$ = this.selections.asObservable();
  isNoSquaresSelected$ = this.selections.pipe(
    map((selections) => selections.every((square) => square.value === null))
  );

  constructor() {}

  private switchPlayer() {
    this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
  }

  markSquare(index: number) {
    const value = this.currentPlayer;
    this.selections.next(
      this.selections
        .getValue()
        .map((square) =>
          square.index === index ? { ...square, value } : square
        )
    );

    this.switchPlayer();
  }

  resetSelections() {
    this.selections.next(INITIAL_SELECTIONS);
  }
}
