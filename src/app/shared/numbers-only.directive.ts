import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[numbersOnly]',
})
export class NumbersOnlyDirective {
  constructor(private ngControl: NgControl) { }

  @HostListener('keyup', ['$event']) onKeyDown(event) {
    let value = <string>event.target.value;
    let filtered = value.replace(/[^0-9]*/g, '');
    this.ngControl.control.patchValue(filtered);
    event.preventDefault();
    return;
  }
}
