import { Directive, ElementRef } from '@angular/core';
import { BaseType, select } from 'd3';

@Directive({
  selector: '[appD3Selection]',
})
export class D3SelectionDirective {
  constructor(private el: ElementRef) {
    console.log(el);
  }

  getSelection<T extends BaseType, T1 = unknown>() {
    return select<T, T1>(this.el.nativeElement);
  }
}
