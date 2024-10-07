import { DestroyRef, inject } from '@angular/core';

export class Destroyable {
  protected readonly destroyRef = inject(DestroyRef);
}
