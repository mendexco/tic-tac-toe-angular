import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SquareComponent } from '@components/square/square.component';
import { FormatSquaresPipe } from '@pipes/formatSquares.pipe';
import { CoreService, WinnerData } from '@services/core/core.service';
import { Nullable } from '@utils/constants';
import { Destroyable } from '@utils/Destroyable';
import { tap } from 'rxjs';

@Component({
  selector: 'app-panel',
  standalone: true,
  template: `
    @for (square of (this.coreServices.selections$ | formatSquares:
    this.winner()); track square.index;) {
    <app-square
      (mark)="handleSelectSquare($event)"
      [disabled]="square.disabled"
      [selected]="square.selected"
      [index]="square.index"
      [value]="square.value"
    />
    }
  `,
  styleUrl: './panel.component.scss',
  imports: [AsyncPipe, FormatSquaresPipe, SquareComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PanelComponent extends Destroyable implements OnInit {
  protected winner = signal<Nullable<WinnerData>>(null);

  constructor(protected coreServices: CoreService) {
    super();
  }

  ngOnInit() {
    this.coreServices.winner$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((winner) => this.winner.set(winner))
      )
      .subscribe();
  }

  handleSelectSquare(squareIndex: number): void {
    this.coreServices.markSquare(squareIndex);
    this.coreServices.checkVictory();
    this.coreServices.switchPlayer();
  }
}
