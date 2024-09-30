import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PanelComponent } from '@components/panel/panel.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PanelComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'tic-tac-toe-angular';
}
