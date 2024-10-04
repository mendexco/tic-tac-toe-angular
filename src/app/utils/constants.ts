import { InjectionToken } from '@angular/core';

type SocialMediaType = {
  href: string;
  icon: string;
  id: string;
  label: string;
};

export interface IConstants {
  socialMedias: { [key in 'linkedIn' | 'github']: SocialMediaType };
}

export const CONSTANTS: IConstants = {
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
