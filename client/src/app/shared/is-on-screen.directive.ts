import { Directive, ElementRef, HostListener } from '@angular/core';
import { hasClass } from './utilities'

@Directive({
  selector: '[appIsOnScreen]'
})
export class IsOnScreenDirective {
  constructor(private el: ElementRef) {
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const el = this.el.nativeElement;
    if (this.isElementInViewport(el)) {
      if (!hasClass(el, 'is-on-screen')) {
        el.classList.add('is-on-screen');
      }
    }
  };

  isElementInViewport(el) {
    const rect = el.getBoundingClientRect();

    return (
      rect.top >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
    );
  }

}
