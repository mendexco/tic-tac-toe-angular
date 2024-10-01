import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { CONSTANTS } from '@utils/constants';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header>
      <a [href]="socialMedias.github.href" target="_blank">
        <i
          [class]="socialMedias.github.icon"
          [attr.aria-label]="socialMedias.github.label"
        ></i>
      </a>
      <h1>TIC-TAC-TOE</h1>
      <aside class="social-medias">
        <a [href]="socialMedias.linkedIn.href" target="_blank">
          <i
            [class]="socialMedias.linkedIn.icon"
            [attr.aria-label]="socialMedias.linkedIn.label"
          ></i>
        </a>
      </aside>
    </header>
  `,
  styleUrl: './header.component.scss',
  imports: [NgFor],
})
export class HeaderComponent {
  socialMedias = CONSTANTS.socialMedias;

  constructor() {
    console.log(window.matchMedia('(prefers-color-scheme: dark)'));
  }
}
