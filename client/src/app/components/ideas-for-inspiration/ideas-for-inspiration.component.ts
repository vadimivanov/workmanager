import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { InspirationService } from '../../shared/services/inspiration/inspiration.service';
import { Category } from '../../shared/models/category.model';
import { Photo } from '../../shared/models/photo.model';

@Component({
  selector: 'app-ideas-for-inspiration',
  templateUrl: './ideas-for-inspiration.component.html',
  styleUrls: ['./ideas-for-inspiration.component.scss']
})
export class IdeasForInspirationComponent implements OnInit {
  private photos: Array<Photo> = [];
  private categories: Array<Category>;
  private currentCategory: number;
  private currentLimit: number = 10;
  private currentOffset: number = 0;

  constructor(private inspirationService: InspirationService, private router: Router) { }

  ngOnInit() {
    this.getInitData();
  }

  private getInitData(): void {
    this.inspirationService.getCategories().subscribe(
      (resp) => {
        this.categories = resp;
      },
      (err) => {
        console.log(err);
      }
    );
    this.inspirationService.getPhotos(null, this.currentLimit, this.currentOffset).subscribe(
      (resp: Photo[]) => {
        this.photos = resp;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  loadCategoryPhotos(id?, offset?): void {
    if (!offset) {
      this.currentOffset = 0;
    }
    this.currentCategory = id ? id : '';
    this.photos = [];
    this.inspirationService.getPhotos(id, this.currentLimit, offset ? offset : 0).subscribe(
      (resp) => {
        if (!offset) {
          this.photos = resp;
        } else {
          this.photos.concat(resp);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  loadMorePhotos() {
    this.currentOffset += 10;
    this.loadCategoryPhotos(this.currentCategory, this.currentOffset);
  }

  loadProviderProfile(id) {
    this.router.navigate(['provider-profile', id]);
  }

}
