import { AsyncPipe, NgClass } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostListener,
  input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { CoreService, type SelectionType } from '@services/core/core.service';
import { type Subscription } from 'rxjs';

@Component({
  selector: 'app-square',
  standalone: true,
  template: `
    <button
      [ngClass]="{
        disabled: this.haveWinner || this.value(),
        victorious: isVictoriousSquare
      }"
      type="button"
    >
      <p>
        {{ value() || '-' }}
      </p>
    </button>
  `,
  styleUrl: './square.component.scss',
  imports: [NgClass, AsyncPipe],
  host: {
    role: 'button',
  },
})
export class SquareComponent implements OnInit, OnDestroy {
  constructor(private coreServices: CoreService) {}

  @Output() mark = new EventEmitter<number>();
  index = input<number>(0);
  value = input<SelectionType>(null);
  haveWinner = false;
  isVictoriousSquare = false;

  winnerSubscription!: Subscription;

  ngOnInit() {
    this.winnerSubscription = this.coreServices.winner$.subscribe((winner) => {
      this.haveWinner = Boolean(winner);
      this.isVictoriousSquare = Boolean(winner?.combination.includes(this.index()))
    });
  }

  ngOnDestroy() {
    this.winnerSubscription.unsubscribe();
  }

  @HostListener('click')
  handleMark() {
    if (this.haveWinner || this.value()) return;
    this.mark.emit(this.index());
  }
}
