import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'addClass',
  standalone: true,
})
@Injectable({
  providedIn: 'root',
})
export class AddClassPipe implements PipeTransform {
  transform(conditional: boolean, className: string) {
    return { [className]: conditional };
  }
}
