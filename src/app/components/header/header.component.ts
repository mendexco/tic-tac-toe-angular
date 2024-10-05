import { NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { CONSTANTS_TOKEN, IConstants } from '@utils/constants';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header>
      <a [href]="CONSTANTS.socialMedias.github.href" target="_blank">
        <i
          [class]="CONSTANTS.socialMedias.github.icon"
          [attr.aria-label]="CONSTANTS.socialMedias.github.label"
        ></i>
      </a>
      <h1>TIC-TAC-TOE</h1>
      <aside class="social-medias">
        <a [href]="CONSTANTS.socialMedias.linkedIn.href" target="_blank">
          <i
            [class]="CONSTANTS.socialMedias.linkedIn.icon"
            [attr.aria-label]="CONSTANTS.socialMedias.linkedIn.label"
          ></i>
        </a>
      </aside>
    </header>
  `,
  styleUrl: './header.component.scss',
  imports: [NgFor],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  constructor(@Inject(CONSTANTS_TOKEN) protected CONSTANTS: IConstants) {}
}
