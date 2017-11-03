import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/observable/forkJoin';

import { InspirationService } from '../../services/inspiration/inspiration.service';
import { ProfileService } from '../../../shared/services/profile/profile.service';
import { Category } from '../../models/category.model';
import { Photo } from '../../models/photo.model';

@Component({
  selector: 'app-ideas-for-inspiration-portfolio',
  templateUrl: './ideas-for-inspiration-portfolio.component.html',
  styleUrls: ['./ideas-for-inspiration-portfolio.component.scss']
})
export class IdeasForInspirationPortfolioComponent implements OnInit, OnChanges {

  @Input() userData: any;
  @Input() limit: any = 0;
  @Input() limitAvailable: any = null;
  @Output() onChangeLimitAvailable: EventEmitter<Object> = new EventEmitter<Object>();

  private photos: Array<Photo> = [];
  private idsOfPhotosToUpdate = [];
  private categories: Array<Category>;

  userId: number;
  userRole: string;
  category: string;
  isUserOwner: boolean = false;
  isCanUpdate = false;

  constructor(
    private router: Router,
    private profileService: ProfileService,
    private inspirationService: InspirationService
  ) {}

  ngOnInit() {
    this.getInitData();
    this.isUserOwner = this.userData.isOwner;
  }

  ngOnChanges(changes: any) {
    if (changes.limit && changes.limit.currentValue) {
      this.limit = changes.limit.currentValue;
    }
    if (changes.limitAvailable) {
      this.limitAvailable = changes.limitAvailable.currentValue;
    }
  }

  private getInitData(): void {
    this.idsOfPhotosToUpdate = [];
    this.inspirationService.getCategories().subscribe(
      (resp) => {
        this.categories = resp;
      }
    );
    this.profileService.getPortfolio(this.userData.id, this.userData.role).subscribe(
      (response) => {
        if (response) {
          this.photos = this.isUserOwner ? response.portfolioPhotos : response.ideaForInspirationPhotos;
          this.checkIsCanUpdate();
        }
      }
    );
  }

  changeLimitAvailable(isAdd) {
    this.checkIsCanUpdate();
    this.onChangeLimitAvailable.emit({edit: isAdd ? -1 : 1});
  }

  checkIsDisabled(image) {
    return !(this.limitAvailable || image.is_idea_for_inspiration) ||
            (this.isUserOwner && this.limitAvailable === null);
  }

  checkIsCanUpdate() {
    this.isCanUpdate = this.photos.every(el => {
      return !(el.is_idea_for_inspiration && !el.inspiration_category_id);
    });
  }

  addToUpdateList(image) {
    if (this.idsOfPhotosToUpdate.indexOf(image.id) < 0) {
      this.idsOfPhotosToUpdate.push(image.id);
    }
  }

  updateInspiration() {
    if (this.isCanUpdate) {
      let photosToUpdate = this.photos.filter((item) => {
        return this.idsOfPhotosToUpdate.indexOf(item.id) !== -1;
      });

      let arrUpdates = [];
      for (let i = 0; i < photosToUpdate.length; i++) {
        let dataToUpdate = photosToUpdate[i];
        arrUpdates.push(this.profileService.updatePortfolio(this.userData.id, this.userData.role, dataToUpdate));
      }

      const multyUpdates = Observable.forkJoin(...arrUpdates);

      multyUpdates.subscribe(
        (resp) => {
          this.photos = [];
          this.getInitData();
        }
      );
    }
  }
}
