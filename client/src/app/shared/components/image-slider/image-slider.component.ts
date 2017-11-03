import { AfterViewInit, Component, ElementRef, HostBinding, HostListener, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import $ from 'jquery';

@Component({
  selector: 'app-image-slider',
  templateUrl: './image-slider.component.html',
  styleUrls: ['./image-slider.component.scss']
})
export class ImageSliderComponent implements AfterViewInit, OnInit, OnChanges {
  @HostBinding('class.image-slider') 1;
  @Input() before: string;
  @Input() after: string;
  @Input() isDisplayComponent: boolean;
  @ViewChild('holderEl') holderEl;
  @ViewChild('beforeEl') beforeEl;
  @ViewChild('dividerEl') dividerEl;
  @ViewChild('imageSlider') imageSlider;

  constructor(private el: ElementRef) {
  }

  @HostListener('mouseleave', [])
  onMouseLeave() {
    $(this.dividerEl.nativeElement).stop().animate({
      left: '50%'
    }, 300);
    $(this.holderEl.nativeElement).stop().animate({
      width: '50%'
    }, 300);
  }
  @HostListener('window:resize', [])
  onWindowResize() {
    this.refreshSizes();
  }
  @HostListener('mousemove', ['$event'])
  onMouseover(e) {
    this.init(e);
  }

  init(e) {
    const $before = $(this.holderEl.nativeElement);
    const $divider = $(this.dividerEl.nativeElement);
    const offX  = e ? (e.offsetX || e.clientX - $before.offset().left) : '50%';
    $before.width(offX);
    $divider.css({left: offX});
  }

  refreshSizes() {
    $(this.beforeEl.nativeElement).width($(this.el.nativeElement).width());
  }

  ngOnInit() {
    this.refreshSizes();
  }

  ngOnChanges() {
    if (this.isDisplayComponent) {
      this.refreshSizes();
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.refreshSizes();
    }, 0);
    this.init(false);
  }
}
