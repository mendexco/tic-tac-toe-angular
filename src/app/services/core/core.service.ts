import { Inject, Injectable, signal } from '@angular/core';
import {
  CONSTANTS_TOKEN,
  IConstants,
  type Nullable,
  type Player,
} from '@utils/constants';
import { BehaviorSubject, combineLatest } from 'rxjs';

export type SelectionType = 'X' | 'O' | null;

export type SquareType = {
  index: number;
  value: SelectionType;
};

export type WinnerData = {
  combination: number[];
  player: Player;
};

const randomizePlayer = (): Player =>
  Math.floor(Math.random() * 2) + 1 === 1 ? 'X' : 'O';

const INITIAL_SELECTIONS = Array.from({ length: 9 }, (_, index) => ({
  index: index + 1,
  value: null,
}));

const WINNING_COMBINATIONS = [
  // horizontal
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  // vertical
  [1, 4, 7],
  [2, 5, 8],
  [3, 6, 9],
  // diagonal
  [1, 5, 9],
  [3, 5, 7],
];

@Injectable({
  providedIn: 'root',
})
export class CoreService {
  currentPlayer = signal<Nullable<Player>>(randomizePlayer());

  private selectionsSubject = new BehaviorSubject<SquareType[]>(
    INITIAL_SELECTIONS
  );
  selections$ = this.selectionsSubject.asObservable();
  private winnerSubject = new BehaviorSubject<Nullable<WinnerData>>(null);
  winner$ = this.winnerSubject.asObservable();
  gameState$ = combineLatest([this.selections$, this.winner$]);

  constructor(@Inject(CONSTANTS_TOKEN) private CONSTANTS: IConstants) {}

  /**
   * Switches current player turn if there is no more squares to select, instead set currentPlayer to null.
   */
  switchPlayer(): void {
    // If all squares are filled, the game is over so it's no one turn
    const areAllSquaresMarked = this.selectionsSubject
      .getValue()
      .every((square) => square.value !== null);
    if (areAllSquaresMarked) {
      this.currentPlayer.set(null);
      return;
    }

    // switches current player turn
    this.currentPlayer.set(
      this.currentPlayer() === this.CONSTANTS.player.X
        ? this.CONSTANTS.player.O
        : this.CONSTANTS.player.X
    );
  }

  /**
   * Checks if a player can match any of the winning combinations with your current selections.
   */
  checkVictory(): void {
    const currentPlayerSelections = this.selectionsSubject
      .getValue()
      .filter((square) => square.value === this.currentPlayer())
      .map((square) => square.index);

    // If there are less than 3 squares selected, than it is impossible for anyone to win
    const noNeedForChecking = currentPlayerSelections.length < 3;
    if (noNeedForChecking) return;

    // checks if some of the winning combinations were matched by current player selections
    const winningCombination = WINNING_COMBINATIONS.find((combination) =>
      combination.every((square) => currentPlayerSelections.includes(square))
    );
    if (winningCombination) {
      const newWinner = {
        combination: winningCombination,
        player: this.currentPlayer()!,
      };
      this.winnerSubject.next(newWinner);
    }

    // if does not matches any combination
    return;
  }

  /**
   * Add selected square to selections array stream.
   * @param index - Square's index that was selected, within a range of 1 to 9.
   * @example markSquare(1)
   */
  markSquare(index: number): void {
    // search for the square that was clicked and update its value
    const newSelections = this.selectionsSubject.getValue().map((square) => {
      if (square.index !== index) return square;
      return { ...square, value: this.currentPlayer() };
    });
    this.selectionsSubject.next(newSelections);
  }

  /**
   * Resets current marked squares, and also re-randomizes the next player turn.
   */
  resetSelections(): void {
    this.winnerSubject.next(null);
    this.selectionsSubject.next(INITIAL_SELECTIONS);
    this.currentPlayer.set(randomizePlayer());
  }
}
