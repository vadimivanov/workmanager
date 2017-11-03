import { Component, ViewChild, ElementRef, Input} from '@angular/core';
import { lory } from 'lory.js';
import { Photo } from '../models/photo.model';

@Component({
  selector: 'app-gallery-component',
  template: `
    <div class="publication__carousel carousel" #publicationCarousel>
      <div class="carousel__frame js-carousel__frame">
        <ul class="carousel__list js-carousel__list">
          <li class="carousel__item" *ngFor="let photo of sliderPhotos">
            <img class="carousel__img js-carousel__img" (load)="imgIsLoaded()"
                 src="{{photo.photo_simple_url}}" width="275" height="275"
                 alt="image description">
          </li>
        </ul>
      </div>
      <span class="carousel__prev js-carousel__prev">
              <svg class="carousel__ico" xmlns="http://www.w3.org/2000/svg" width="50" height="50"
                   viewBox="0 0 501.5 501.5"><g><path
                fill="#2E435A"
                d="M302.67 90.877l55.77 55.508L254.575 250.75 358.44 355.116l-55.77 55.506L143.56 250.75z"/></g></svg>
            </span>
      <span class="carousel__next js-carousel__next">
              <svg class="carousel__ico" xmlns="http://www.w3.org/2000/svg" width="50" height="50"
                   viewBox="0 0 501.5 501.5"><g><path
                fill="#2E435A"
                d="M199.33 410.622l-55.77-55.508L247.425 250.75 143.56 146.384l55.77-55.507L358.44 250.75z"/></g></svg>
            </span>
    </div>
  `
})
export class GalleryComponent {
  private publicationCarouselObj: any;
  @ViewChild('publicationCarousel') private publicationCarousel: ElementRef;
  @Input() sliderPhotos: Photo[];

  constructor() {}

  imgIsLoaded() {
    try {
      this.publicationCarouselObj = lory(this.publicationCarousel.nativeElement, {
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

}
