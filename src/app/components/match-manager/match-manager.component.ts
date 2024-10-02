import { Component } from '@angular/core';

@Component({
  selector: 'app-match-manager',
  standalone: true,
  template: `
    <nav>
      <div>
        <p>
          Player1 <span>{{ player1Wins }}</span> x
          <span>{{ player2Wins }}</span> Player2
        </p>
      </div>
      <button type="button">{{ isRunning ? 'RESTART' : 'START' }}</button>
    </nav>
  `,
  styleUrl: './match-manager.component.scss',
})
export class MatchManagerComponent {
  isRunning = false;
  player1Wins = 0;
  player2Wins = 0;
}
