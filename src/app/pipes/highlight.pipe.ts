import { Pipe, PipeTransform } from '@angular/core';
import { AddClassPipe } from '@pipes/addClass.pipe';

@Pipe({
  name: 'highlight',
  standalone: true,
})
export class HighlightPipe implements PipeTransform {
  constructor(private addClassPipe: AddClassPipe) {}

  transform(conditional: boolean) {
    return this.addClassPipe.transform(conditional, 'highlighted');
  }
}
