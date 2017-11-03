import { AfterViewInit, Component, ElementRef, HostBinding, Input, OnInit } from '@angular/core';
import { lory } from 'lory.js';
import { Lightbox } from 'angular2-lightbox';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements AfterViewInit, OnInit {
  @HostBinding('class.carousel') 1;
  @Input() items: string[];
  @Input() itemFn: void;
  private carousel: ElementRef;
  private carouselObj: any;
  albums = [];

  constructor(private _lightbox: Lightbox,
              hostEl: ElementRef) {
    this.carousel = hostEl;
  }

  ngOnInit() {
    for (let i = 0; i < this.items.length; i++) {
      const src = this.items[i];
      const caption = 'Image caption here ' + i;
      const thumb = this.items[i];
      const album = {
        src: src,
        caption: caption,
        thumb: thumb
      };
      this.albums.push(album);
    }
  }

  open(index: number): void {
    // open lightbox
    this._lightbox.open(this.albums, index);
  }

  ngAfterViewInit() {
    try {
      this.carouselObj = lory(this.carousel.nativeElement, {
        infinite: 0,
        classNameFrame: 'js-carousel__frame',
        classNameSlideContainer: 'js-carousel__list',
        classNamePrevCtrl: 'js-carousel__prev',
        classNameNextCtrl: 'js-carousel__next'
      });
    } catch (err) {
      console.log('Error in the Gallery component.\n\n', err);
    }
  }

  imgIsLoaded(): void {
    this.carouselObj.reset();
  }
}
