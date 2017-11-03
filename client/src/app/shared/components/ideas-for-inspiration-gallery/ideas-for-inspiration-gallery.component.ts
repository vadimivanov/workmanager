import { TemplateRef, AfterViewInit, OnChanges, ViewChild, Component, ElementRef, HostBinding,
  Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Lightbox } from 'angular2-lightbox';
import $ from 'jquery';
import Swiper from 'swiper';

import { InspirationService } from '../../services/inspiration/inspiration.service';
import { Category } from '../../models/category.model';
import { Photo } from '../../models/photo.model';

interface LightboxItem {
  src: string,
  caption: string,
  thumb: string
}

@Component({
  selector: 'app-ideas-for-inspiration-gallery',
  templateUrl: './ideas-for-inspiration-gallery.component.html',
  styleUrls: ['./ideas-for-inspiration-gallery.component.scss']
})
export class IdeasForInspirationGalleryComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('galleryTmpl') galleryTmpl: TemplateRef<any>;
  @ViewChild('standalonePageTmpl') standalonePageTmpl: TemplateRef<any>;
  @Input() standalonePage = true;
  @Input() displayComponent: boolean;
  // @ViewChild('sliderWrapper') sliderWrapper;

  sliderMainSlider: any;
  public photos: Array<Photo> = [];
  public currentCategory: any = null;
  public lightboxList = [];
  private categories: Array<Category>;
  private categoriesFiltering: Array<Category>;
  private currentLimit = 12;
  private currentOffset = 0;

  constructor(private _lightbox: Lightbox, private inspirationService: InspirationService, private router: Router) { }

  ngAfterViewInit() {
    this.initSliders();
  }

  ngOnInit() {
    this.getInitData();
    setTimeout(() => {
      this.refreshSlider();
    }, 5000);
  }

  initSliders() {
    setTimeout(() => {
      try {
        const gallery = $('.home-inspiration-gallery');

        if (gallery.length) {
          const sliderEl = gallery[0];
          if (sliderEl) {
            this.sliderMainSlider = new Swiper(sliderEl, {
              speed: 400,
              spaceBetween: 0,
              slidesPerView: 4,
              nextButton: '.js-shifter__next',
              prevButton: '.js-shifter__prev',
            });
          }
        }
      } catch (err) {
        console.log('Error in the Portfolio Gallery component.\n\n', err);
      }
    }, 0);
  }

  refreshSlider() {
    setTimeout(() => {
      this.initSliders();
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

  private getListForModal(data): LightboxItem[] {
    return data.map((item) => {
      const srcPhoto = item.photo_simple_url ? item.photo_simple_url : item.photo_after_url;
      return {
        src: srcPhoto,
        caption: item.Provider ? item.Provider.company_name : '',
        thumb: srcPhoto
      }
    })
  }

  private getInitData(): void {
    this.inspirationService.getCategories().subscribe(
      (resp) => {
        this.categories = resp;
        this.filterCategories();
      },
      (err) => {
        console.log(err);
      }
    );
    this.inspirationService.getPhotos(null, this.currentLimit, this.currentOffset).subscribe(
      (resp: Photo[]) => {
        this.photos = this.filterPhotos(resp);
        this.lightboxList = this.getListForModal(this.photos);
        this.refreshSlider();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  filterCategories() {
    this.categoriesFiltering = this.categories.filter((item) => {
      return item.isShowOnHomePage;
    });
  }

  private filterPhotos(photos): Photo[] {
    return photos;
    // return photos.filter((item) => {
    //   return item.photo_simple_url !== null;
    // });
  }

  loadCategoryPhotos($event, id?, offset?, isFullPage?): void {
    if (!offset) {
      this.currentOffset = 0;
    }

    if (!id && $event) {
      if (isFullPage) {
        id = this.categories[$event.index - 1] ? this.categories[$event.index - 1].id : '';
      } else {
        id = this.categoriesFiltering[$event.index - 1] ? this.categoriesFiltering[$event.index - 1].id : '';
      }
    }

    this.currentCategory = id ? id : null;

    this.photos = [];

    this.inspirationService.getPhotos(id, this.currentLimit, offset ? offset : 0).subscribe(
      (resp: Photo[]) => {
        if (!offset) {
          this.photos = this.filterPhotos(resp);
        } else {
          this.photos = this.photos.concat(this.filterPhotos(resp));
        }

        this.refreshSlider();

        this.lightboxList = this.getListForModal(this.photos);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  isShowBtnMore() {
    return this.photos.length >= this.currentLimit;
  }

  loadMorePhotos($event) {
    $event.preventDefault();
    this.loadCategoryPhotos(false, this.currentCategory, this.currentOffset, true);
  }

  loadProviderProfile(id) {
    this.router.navigate(['provider-profile', id]);
  }

  getTemplate() {
    return this.standalonePage ? this.standalonePageTmpl : this.galleryTmpl;
  }

  openLightbox(list, index: number): void {
    this._lightbox.open(list, index, {
      disableScrolling: true,
      positionFromTop: 0,
      alwaysShowNavOnTouchDevices: true
    });
  }
}
