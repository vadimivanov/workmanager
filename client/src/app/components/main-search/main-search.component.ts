import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MdDialog } from '@angular/material';

import { Category } from '../../shared/models/category.model';
import { Photo} from '../../shared/models/photo.model';
import { GeocodingService } from '../../shared/services/geocoding/geocoding.service';
import { InfoDialogComponent } from '../../shared/components/modals/info-dialog/info-dialog.component';
import { InspirationService } from '../../shared/services/inspiration/inspiration.service';
import { ProviderSearchService } from '../../shared/services/provider-search/provider-search.service';
import { ProviderServicesService } from '../../shared/services/provider-services/provider-services.service';

@Component({
  selector: 'app-main-search',
  templateUrl: './main-search.component.html',
  styleUrls: ['./main-search.component.scss']
})
export class MainSearchComponent implements OnInit {
  searchResults: Array<any> = [];
  searchConfig: Array<any> = [];
  searchCategory: any;
  queryParams: any;
  providerServices: Array<any> = [];
  providerServicesMap: Array<any> = [];
  filteredServices: Array<any> = [];
  providerList: Array<any> = [];
  providerPreviewList: Array<any> = [];
  servicesPreviewList: Array<any> = [];
  photoPreviewList: Array<any> = [];
  location: {
    latitude: string,
    longitude: string,
    distance: number
  } = {
    latitude: '',
    longitude: '',
    distance: 0
  };
  distance = 0;
  searchValue = '';
  cities: any[];
  cityCtrl: FormControl;
  filteredCities: any;
  disabledSlider = true;
  isSearchingLocation = false;
  stateToggleValue = false;
  isLoad = false;
  private photos: Array<Photo> = [];
  private categories: Array<Category>;
  private currentCategory: number;
  private currentLimit = 10;
  private currentOffset = 0;
  @ViewChild('geoSearchField') geoEl: ElementRef;

  constructor(private providerSearchService: ProviderSearchService,
              private providerServicesService: ProviderServicesService,
              public dialog: MdDialog,
              private inspirationService: InspirationService,
              private router: Router) {
  }

  ngOnInit() {
    this.getServices();
    this.getTopServices();
    this.getTopProviders();
    this.getInspiratonPhotos();
  }

  stateToggle() {
    this.stateToggleValue = !this.stateToggleValue;
  }

  search(input?): void {
    if (input && input.value.length) {
      this.searchConfig.push({searchKey: 'searchText', searchValue: input.value});
    }
    if (this.searchCategory) {
      this.searchConfig.push(this.searchCategory);
    }

    this.providerSearchService.mainSearch(this.searchConfig).subscribe(
      (resp) => {
        if (resp) {
          this.searchResults = resp;
          this.router.navigate(['search-result'], {
            queryParams: {
              searchResults: JSON.stringify(this.searchResults),
              searchParams: JSON.stringify(this.searchConfig),
              providerServices: JSON.stringify(this.providerServices)
            }
          });
          this.isLoad = false;
          this.clearSearchParams(input);
        } else {
          this.openDialog();
        }
      },
      (error) => {
        this.clearSearchParams(input);
      }
    );
  }

  clearSearchParams(input): void {
    if (input && input.value.length) {
      input.value = '';
    }
    this.searchCategory = '';
    this.searchConfig = [];
  }

  chooseCategory(category, searchKey): void {
    if (!this.isLoad) {
      this.isLoad = true;
      this.clearSearchParams(null);
      this.searchCategory = {searchKey: searchKey, searchValue: category};
      this.search();
    }
  }

  searchTopCategory(category, searchKey): void {
    this.clearSearchParams(null);
    this.searchCategory = {searchKey: searchKey, searchValue: category};
    this.search();
  }

  getMaxRating(dataArr, list, cb): void {
    const arrMax = [];
    for (let j = 0; j < 3; j++) {
      const max = Math.max.apply(null, dataArr);
      arrMax.push(max);
      dataArr.splice(dataArr.indexOf(max), 1);
    }
    cb(arrMax, list);
  }

  getTopPhotos(dataArr, list): void {
    for (let i = 0; i < list.length; i++) {
      const obj = list[i];
      if (dataArr.indexOf(obj.service_id) >= 0 && this.photoPreviewList.length <= 2) {
        this.photoPreviewList.push(obj);
      }
    }
  }

  getServices(): void {
    this.providerServicesService.services.subscribe(
      (resp) => {
        this.providerServices = resp;
      }
    );
  }

  getTopServices(): void {
    this.providerServicesService.getTopServices().subscribe(
      (resp) => {
        this.servicesPreviewList = resp;
      }
    );
  }

  getTopProviders(): void {
    this.providerServicesService.getTopProviders().subscribe(
      (resp) => {
        this.providerPreviewList = resp;
      }
    );
  }

  getInspiratonPhotos(): void {
    this.inspirationService.getPhotos(null, this.currentLimit, this.currentOffset).subscribe(
      (resp: Photo[]) => {
        this.photos = resp;

        // replace with countRating after backend changes
        const arr = [];
        for (let i = 0; i < this.photos.length; i++) {
          const obj = this.photos[i];
          arr.push(obj.service_id);
        }
        const rate = this.getMaxRating;
        new rate(arr, this.photos, this.getTopPhotos.bind(this));
      }
    );
  }

  openDialog() {
    const dialogRef = this.dialog.open(InfoDialogComponent);
    dialogRef.componentInstance.infoText = 'Es gibt keine Dienstleister in dieser Kategorie';
    this.isLoad = false;
    dialogRef.afterClosed().subscribe(result => {
      this.isLoad = false;
    });
  }
}
