import { Inject, Injectable } from '@angular/core';
import { CONSTANTS_TOKEN, IConstants } from '@utils/constants';
import { BehaviorSubject, map } from 'rxjs';

export type SelectionType = 'X' | 'O' | null;

export type SquareType = {
  index: number;
  value: SelectionType;
};

const randomizePlayer = (): SelectionType =>
  Math.floor(Math.random() * 2) + 1 === 1 ? 'X' : 'O';

const INITIAL_SELECTIONS = Array.from({ length: 9 }, (_, index) => ({
  index,
  value: null,
}));

@Injectable({
  providedIn: 'root',
})
export class CoreService {
  currentPlayer = randomizePlayer();

  private selections = new BehaviorSubject<SquareType[]>(INITIAL_SELECTIONS);

  selections$ = this.selections.asObservable();
  isNoSquaresSelected$ = this.selections.pipe(
    map((selections) => selections.every((square) => square.value === null))
  );

  constructor(@Inject(CONSTANTS_TOKEN) private CONSTANTS: IConstants) {}

  private switchPlayer() {
    // If all squares are filled, the game is over so it's no one turn
    if (this.selections.getValue().every((square) => square.value !== null)) {
      this.currentPlayer = null;
      return;
    }

    this.currentPlayer =
      this.currentPlayer === this.CONSTANTS.players.X
        ? this.CONSTANTS.players.O
        : this.CONSTANTS.players.X;
  }

  markSquare(index: number) {
    // search for the square that was clicked and update its value
    const value = this.currentPlayer;
    this.selections.next(
      this.selections.getValue().map((square) => {
        if (square.index !== index) return square;
        return { ...square, value };
      })
    );
    // switch player after marking the square
    this.switchPlayer();
  }

  resetSelections() {
    this.selections.next(INITIAL_SELECTIONS);
    this.currentPlayer = randomizePlayer();
  }
}
