import { AsyncPipe } from '@angular/common';
import { ChangeDetectorRef, Pipe, PipeTransform } from '@angular/core';
import { type SquareType, type WinnerData } from '@services/core/core.service';
import { type Nullable } from '@utils/constants';
import { Observable } from 'rxjs';

export type SquareIncremented = SquareType & {
  disabled: boolean;
  selected: boolean;
};

@Pipe({
  name: 'formatSquares',
  standalone: true,
  pure: false,
})
export class FormatSquaresPipe implements PipeTransform {
  private asyncPipe: AsyncPipe;

  constructor(private cdr: ChangeDetectorRef) {
    this.asyncPipe = new AsyncPipe(cdr);
  }

  transform(
    squares$: Observable<Nullable<SquareType[]>>,
    winner: Nullable<WinnerData>
  ): SquareIncremented[] {
    const squares = this.asyncPipe.transform(squares$);

    const formattedSquares = squares?.map((square) => ({
      disabled: this.checkIsDisabled(square.index, winner),
      index: square.index,
      selected: this.checkIsSelected(square, winner),
      value: square.value,
    }));

    return formattedSquares ?? [];
  }

  checkIsDisabled(index: number, winner: Nullable<WinnerData>): boolean {
    const isVictoriousSquare = winner?.combination.includes(index) ?? false;
    const haveWinner = Boolean(winner);

    return haveWinner && !isVictoriousSquare;
  }

  checkIsSelected(square: SquareType, winner: Nullable<WinnerData>): boolean {
    const isVictoriousSquare =
      winner?.combination.includes(square.index) ?? false;
    const hasValueSelected = Boolean(square.value);

    return (
      isVictoriousSquare ||
      (hasValueSelected && !this.checkIsDisabled(square.index, winner))
    );
  }
}
