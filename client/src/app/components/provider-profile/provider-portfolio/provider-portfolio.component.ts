import { Component, OnInit, OnChanges, Input, Output, EventEmitter, ViewChild } from '@angular/core';

import { ProfileService } from '../../../shared/services/profile/profile.service';
import { AuthGroup } from '../../../shared/models/auth-group';
import { AuthService } from '../../../shared/services/auth/auth.service';

@Component({
  selector: 'app-provider-portfolio',
  templateUrl: './provider-portfolio.component.html',
  styleUrls: ['./provider-portfolio.component.scss']
})
export class ProviderPortfolioComponent extends AuthGroup implements OnInit, OnChanges {
  @Input() user: any = {};
  @Input() isOwner: boolean = false;
  @Input() displayComponent: boolean;

  userId: number;
  userRole: any;
  isUserOwner: boolean = false;

  public portfolioCategory: string;
  isInspiration = false;

  services = [];
  categoriesList = [];
  photos = [];
  idsPhotosCategories = [];
  categories = [];

  limits = {
    inspiration: 0,
    inspirationAvailable: null,
    photosSimple: 0,
    photosSimpleAvailable: 0,
    photosSimpleVisibleAvailable: 0,
    photosBeforeAfter: 0,
    photosBeforeAfterAvailable: 0,
    photosBeforeAfterVisibleAvailable: 0
  };
  limitsSend: any = null;
  isLoadedCategories = false;

  constructor(
    private profileService: ProfileService,
    authService: AuthService
  ) {
    super(authService);
  }

  ngOnInit() {
    this.initData(this.user);
  }

  ngOnChanges(changes: any) {
    if (changes.displayComponent && changes.displayComponent.currentValue) {
      if (this.userId) {
        this.getSubServices();
      }
    }
  }

  initData(user) {
    if (user) {
      this.userId = user.id;
      this.userRole = user.roleLowered;
      this.isUserOwner = this.isOwner;

      this.loadCategoryPhotos('all');
      this.getPortfolio(true);
    }
  }

  loadCategoryPhotos(category) {
    this.isInspiration = false;
    this.portfolioCategory = category;
  }

  getPortfolio(isLoadAddsData?) {
    this.profileService.getPortfolio(this.userId, this.userRole).subscribe(
      (resp) => {
        const response = Object.keys(resp);
        this.photos = response.length ? resp.portfolioPhotos : [];

        // If need load Services and Limits
        if (isLoadAddsData) {
          this.getSubServices();

          if (this.isOwner) {
            this.getLimitUser();
          }
        } else {
          // Otherwise we revise the list of categories in tabs
          // and recount uploaded Photos
          this.getCategories();
          this.countUploadedAndVisiblePhotos();
          this.countLimitInspirationAvailable();
        }
      }
    );
  }

  getLimitUser() {
    this.profileService.getUsersPlansLimit(this.userId).subscribe(
      (resp) => {
        if (resp.photos_inspiration_page_limit) {
          this.limits.inspiration = resp.photos_inspiration_page_limit;
          this.countLimitInspirationAvailable();
        }
        if (resp.photos_simple_limit) {
          this.limits.photosSimple = resp.photos_simple_limit;
        }
        if (resp.photos_before_after_limit) {
          this.limits.photosBeforeAfter = resp.photos_before_after_limit;
        }

        this.countUploadedAndVisiblePhotos();

      }
    );
  }

  countUploadedAndVisiblePhotos() {
    let uploadedSimple = 0;
    let uploadedBeforeAfter = 0;
    let visibleSimple = 0;
    let visibleBeforeAfter = 0;

    this.photos.forEach((photo) => {
      if (photo.photo_simple_url) {
        uploadedSimple++;
        photo.is_visible ? visibleSimple++ : null;
      } else {
        uploadedBeforeAfter++;
        photo.is_visible ? visibleBeforeAfter++ : null;

      }
    });

    this.limits = Object.assign({}, this.limits);

    this.limits.photosSimpleAvailable = this.limits.photosSimple - uploadedSimple;
    this.limits.photosBeforeAfterAvailable = this.limits.photosBeforeAfter - uploadedBeforeAfter;

    this.limits.photosSimpleVisibleAvailable = this.limits.photosSimple - visibleSimple;
    this.limits.photosBeforeAfterVisibleAvailable = this.limits.photosBeforeAfter - visibleBeforeAfter;

    this.limitsSend = this.limits;
  }

  getSubServices() {
    this.profileService.getSubServices(this.userId, this.userRole).subscribe(
      (resp) => {
        const tempServices = [];
        this.services = Object.keys(resp);
        this.isLoadedCategories = true;
        if (this.services.length) {
          this.services = resp
            .map((item) => {
              return item.Service;
            })
            .filter((service, i, self) => {
              if (tempServices.indexOf(service.id) < 0) {
                tempServices.push(service.id);
                return tempServices.indexOf(service.id) >= 0;
              }
            });

          this.categoriesList = this.services;

          this.getCategories();
        }
      }
    );
  }

  getCategories() {
    // Collect all the categories used in the photo;
    this.photos.forEach(el => {
      if (this.idsPhotosCategories.indexOf(el.service_id) < 0) {
        this.idsPhotosCategories.push(el.service_id);
      }
    });

    // Filtering the categories you need;
    this.categories = this.services.filter(service => {
      return this.idsPhotosCategories.indexOf(service.id) !== -1;
    });
  }

  getLimitInspiration(prop) {
    this.limits.inspirationAvailable += prop.edit;
  }

  countLimitInspirationAvailable() {
    let count = 0;

    this.photos.forEach(el => {
      if (el.is_idea_for_inspiration) {
        count++;
      }
    });

    count = this.limits.inspiration - count;

    this.limits.inspirationAvailable = count > 0 ? count : 0;
  }

  goToInspirationTab() {
    this.isInspiration = true;
    this.countLimitInspirationAvailable();
  }
}
