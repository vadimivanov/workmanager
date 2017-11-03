import {
  AfterContentChecked, AfterViewInit, OnChanges, ViewChild, Component, ElementRef, HostBinding,
  Input, OnInit
} from '@angular/core';
import Swiper from 'swiper';

@Component({
  selector: 'app-shifter',
  templateUrl: './shifter.component.html',
  styleUrls: ['./shifter.component.scss']
})
export class ShifterComponent implements OnInit, AfterViewInit, OnChanges {
  @HostBinding('class.shifter') 1;
  @Input() items: any[];
  @Input() displayComponent: boolean;
  @ViewChild('sliderMain') sliderMain;

  public shifter: ElementRef;
  public shifterObj: any;
  sliderMainSlider: any;

  constructor(hostEl: ElementRef) {
    this.shifter = hostEl;
  }

  ngAfterViewInit() {
    this.initSliders();
  }

  ngOnInit() {
    setTimeout(() => {
      this.refreshSlider();
    }, 5000);
  }

  initSliders() {
    setTimeout(() => {
      try {
        if (this.sliderMain && (!this.sliderMainSlider || !this.sliderMainSlider.isInitSlider)) {
          this.sliderMainSlider = new Swiper(this.sliderMain.nativeElement, {
            speed: 400,
            spaceBetween: 100,
            nextButton: '.js-shifter__next',
            prevButton: '.js-shifter__prev',
          });
          this.sliderMainSlider.isInitSlider = true;
        }
      } catch (err) {
        console.log('Error in the Portfolio Gallery component.\n\n', err);
      }
    }, 0);
  }

  refreshSlider() {
    setTimeout(() => {
      if (this.sliderMainSlider) {
        this.sliderMainSlider.slideTo(0, 0);
        this.sliderMainSlider.destroy();
        this.sliderMainSlider = null;
        this.initSliders();
      }
    }, 0);
  }

  ngOnChanges(changes: any) {
    if ( this.displayComponent ||
      (changes.currentCategory &&
      (changes.currentCategory.currentValue !== changes.currentCategory.previousValue))
    ) {
      this.refreshSlider();
    }
    if ( changes.items && changes.items.previousValue ) {
      this.refreshSlider();
    }
  }
}
