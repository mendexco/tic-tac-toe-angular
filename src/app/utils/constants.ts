import { InjectionToken } from '@angular/core';

export type Nullable<T> = T | null;


type SocialMediaType = {
  href: string;
  icon: string;
  id: string;
  label: string;
};

export type Player = 'X' | 'O';

export interface IConstants {
  players: { [key in Player]: Player };
  socialMedias: { [key in 'linkedIn' | 'github']: SocialMediaType };
}

export const CONSTANTS: IConstants = {
  players: { X: 'X', O: 'O' },
  socialMedias: {
    linkedIn: {
      href: 'https://www.linkedin.com/in/vitor-mendesco',
      icon: 'devicon-linkedin-plain',
      id: 'linkedin',
      label: 'LinkedIn',
    },
    github: {
      href: 'https://github.com/mendexco',
      icon: 'devicon-github-original',
      id: 'github',
      label: 'GitHub',
    },
  },
};

export const CONSTANTS_TOKEN = new InjectionToken<IConstants>('CONSTANTS', {
  providedIn: 'root',
  factory: () => CONSTANTS,
});
