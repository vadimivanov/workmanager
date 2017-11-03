import {Component, OnInit, OnChanges, Input, Output, DoCheck, ViewChild, AfterViewInit, EventEmitter, HostBinding} from '@angular/core';
import {MdDialog} from '@angular/material';
import {DialogService} from '../../services/dialog/dialog.service';
import {ProfileService} from '../../services/profile/profile.service';
import 'rxjs/operator/distinctUntilChanged';
import Swiper from 'swiper';
import {ConfirmDialogComponent} from '../modals/confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-portfolio-gallery',
  templateUrl: './portfolio-gallery.component.html',
  styleUrls: ['./portfolio-gallery.component.scss']
})
export class PortfolioGalleryComponent implements OnInit, DoCheck, AfterViewInit, OnChanges {

  userId: number;
  userRole: string;
  isOwner = false;

  categories = [];
  selectedPhotos = [];
  images = [];
  sliderMainSlider: any;
  sliderNavSlider: any;

  limitsPhotosSimple = 0;
  limitsPhotosSimpleAvailable = 0;
  limitsPhotosBeforeAfter = 0;
  limitsPhotosBeforeAfterAvailable = 0;

  isCanAddPhotos = false;

  selectedPhotosReceived = new EventEmitter();

  @HostBinding('class.portfolio-gallery') 1;
  @Input() userData: any;
  @Input() currentCategory: any;
  @Input() photos: any;
  @Input() limits: any;
  @Input() categoriesList = [];
  @Input() displayComponent: boolean;
  @ViewChild('sliderMain') sliderMain;
  @ViewChild('sliderNav') sliderNav;
  @Output() changePhotosList: EventEmitter<Object> = new EventEmitter<Object>();


  constructor(public dialog: MdDialog,
              private profileService: ProfileService,
              private dialogService: DialogService) {
  }

  ngAfterViewInit() {
    this.selectedPhotosReceived
      .distinctUntilChanged()
      .subscribe((el: any) => {
        if (el.length) {
          this.initSliders();
        }
      });
    this.refreshSliders();
  }

  slideTo(currentSlide) {
    this.sliderMainSlider.slideTo(currentSlide);
    this.sliderNavSlider.slideTo(currentSlide);
  }

  ngOnInit() {
    this.getUserData();
  }

  getUserData() {
    this.userId = this.userData.id;
    this.userRole = this.userData.role;
    this.isOwner = this.userData.isOwner;
    this.categories = this.categoriesList;

    if (this.limits) {
      this.limitsPhotosSimple = this.limits.photosSimple;
      this.limitsPhotosSimpleAvailable = this.limits.photosSimpleAvailable;
      this.limitsPhotosBeforeAfter = this.limits.photosBeforeAfter;
      this.limitsPhotosBeforeAfterAvailable = this.limits.photosBeforeAfterAvailable;
      this.checkCanAddPhotos();
    }

    this.refreshSliders();
  }

  initSliders() {
    setTimeout(() => {
      try {
        if (this.sliderMain && (!this.sliderMainSlider || !this.sliderMainSlider.isInitSlider)) {
          this.sliderMainSlider = new Swiper(this.sliderMain.nativeElement, {
              speed: 400,
              spaceBetween: 100,
              nextButton: '.swiper-button__next',
              prevButton: '.swiper-button__prev',
              onSlideChangeStart: (swiper) => {
                this.slideTo(swiper.activeIndex);
              }
          });
          this.sliderMainSlider.isInitSlider = true;
        }
        if (this.sliderMain && (!this.sliderNavSlider || !this.sliderNavSlider.isInitSlider)) {
          this.sliderNavSlider = new Swiper(this.sliderNav.nativeElement, {
              speed: 400,
              slidesPerView: 6,
              spaceBetween: 10,
              breakpoints: {
                767: {
                  slidesPerView: 3
                },
              },
              onSlideChangeStart: (swiper) => {
                this.slideTo(swiper.activeIndex);
              }
          });
          this.sliderNavSlider.isInitSlider = true;
        }
      } catch (err) {
        console.log('Error in the Portfolio Gallery component.\n\n', err);
      }
    }, 0);
  }

  refreshSliders() {
    setTimeout(() => {
      if (this.sliderMainSlider && this.sliderNavSlider) {
          this.sliderMainSlider.slideTo(0, 0);
          this.sliderMainSlider.destroy();
          this.sliderMainSlider = null;
          this.sliderNavSlider.slideTo(0, 0);
          this.sliderNavSlider.destroy();
          this.sliderNavSlider = null;
          this.initSliders();
      }
    }, 0);
  }

  ngOnChanges(changes: any) {
    if ( this.displayComponent ||

        (changes.currentCategory &&
        (changes.currentCategory.currentValue !== changes.currentCategory.previousValue)) ||

        changes.photos &&
        (changes.photos.currentValue !== changes.photos.previousValue)
        ) {
      this.refreshSliders();
    }
    if ( changes.userData &&
         changes.userData.previousValue &&
        (changes.userData.previousValue.id !== changes.userData.currentValue.id) ||

        changes.limits &&
        (changes.limits.currentValue !== changes.limits.previousValue) ||

        changes.categoriesList &&
        (changes.categoriesList.currentValue !== changes.categoriesList.previousValue)
       ) {

      this.getUserData();
      this.refreshSliders();
    }
  }


  ngDoCheck() {
    if (this.currentCategory) {
      this.selectedPortfolio();
    }
  }

  selectedPortfolio() {
    this.selectedPhotos = this.photos
      .filter((photo) => {
        return photo.service_id === this.currentCategory;
      });
    if (this.currentCategory === 'all') {
      this.selectedPhotos = this.photos;
    }

    this.selectedPhotosReceived.emit(this.selectedPhotos);
  }

  isAllowLimitsAddPhotos() {
    return (this.limitsPhotosSimpleAvailable > 0) ||
           (this.limitsPhotosBeforeAfterAvailable > 0);

  }

  checkCanAddPhotos() {
    this.isCanAddPhotos =  this.isOwner
           && this.isAllowLimitsAddPhotos()
           && this.categories.length
           && this.currentCategory === 'all';
  }

  openDialog(event, model) {
    this.dialogService
      .uploadPhotoDialog({
        userId: this.userId,
        userRole: this.userRole,
        categoriesList: this.categories,
        limits: this.limits,
        photoModel: model
      })
      .subscribe(
        (res) => {
          if (res && res.msg) {
            this.changePhotosList.emit();
          }
        }
      );
  }

  editPhoto(photo) {
    this.openDialog(null, photo);
  }

  confirmDialog(photoId) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.componentInstance.infoText = 'Wollen Sie es löschen?';
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.msg) {
        this.deletePhoto(photoId);
      }
    });
  }

  deletePhoto(photoId) {
    this.profileService.deletePhoto(this.userId, this.userRole, {id: photoId}).subscribe(
      () => {
        this.changePhotosList.emit();
      }
    );
  }
}
