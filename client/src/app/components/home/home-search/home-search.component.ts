import { Component, OnInit, EventEmitter, ElementRef, ViewChild, HostBinding } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MdDialog } from '@angular/material';

import { ProviderSearchService } from '../../../shared/services/provider-search/provider-search.service';
import { ProviderServicesService } from '../../../shared/services/provider-services/provider-services.service';
import { GeocodingService } from '../../../shared/services/geocoding/geocoding.service';
import { InfoDialogComponent } from '../../../shared/components/modals/info-dialog/info-dialog.component';

@Component({
  selector: 'app-home-search',
  templateUrl: './home-search.component.html',
  styleUrls: ['./home-search.component.scss']
})
export class HomeSearchComponent implements OnInit {
  @HostBinding('class.promo') 1;
  searchResults: any = [];
  cityParam: any;
  zipParam: any;
  distanceParam: any;
  serviceParam: any;
  latitudeParam: any;
  longitudeParam: any;
  searchConfig: any = [];
  searchParams = {
    searchCity: null,
    searchZip: null,
    searchCategory: null,
    searchText: null,
    distance: null,
    lat: null,
    lng: null
  };
  searchValue = '';
  providerId: number;
  isChoosedSearch = false;
  isLoad = false;
  providerServicesMap = [];
  currentProvider = [];
  filteredServices = [];
  metatagsResult = [];
  location: {
    latitude: string,
    longitude: string,
    distance: number
  } = {
    latitude: '',
    longitude: '',
    distance: 0
  };
  distance = 10000;
  distanceModel = 0;
  cities = [];
  cityCtrl: FormControl;
  selectedCity = '';
  selectedCategory = '';
  currentCity = '';
  currentZipCode = '';
  filteredCities: any;
  disabledSlider = true;
  isSearchingLocation = false;
  loading: EventEmitter<boolean> = new EventEmitter<boolean>();
  // results: EventEmitter<SearchResult[]> = new EventEmitter<SearchResult[]>();
  @ViewChild('searchField') el: ElementRef;
  @ViewChild('geoSearchField') geoEl: ElementRef;

  constructor(
    public dialog: MdDialog,
    private providerSearchService: ProviderSearchService,
    private providerServicesService: ProviderServicesService,
    private geocodingService: GeocodingService,
    private router: Router) { }

  ngOnInit() {
    this.distanceParam = {searchKey: 'distance', searchValue: this.distance};
    this.providerServicesService.services.subscribe(
      (resp) => {
        this.createMap(resp, true);
      }
    );
    Observable.fromEvent(this.el.nativeElement, 'keyup')
      .map((e: any) => e.target.value)
      .do(() => {
        this.searchResults = [];
        this.filteredServices = [];
        if (!this.el.nativeElement.value.length) {
          this.searchParams.searchText = null;
          this.clearSearchParams();
        }
      })
      .filter((text: string) => text.length > 2)
      .debounceTime(300)
      .do((e) => {
        this.onKeyupSearchService(e);
        this.loading.next(true);
        this.filterServices(e);
      })
      .map((query: string) => this.providerSearchService.mainSearch(this.fillSearchConfig({searchKey: 'searchText', searchValue: query})))
      .switch()
      .subscribe(
        (results: any) => {
          this.loading.next(false);
          let tempCollection;
          if (results && results._body) {
            tempCollection = JSON.parse(results._body).filter((item) => {
              return item.company_name;
            });
          }
          if (results) {
            tempCollection = results.filter((item) => {
              return item.company_name;
            });
            for (let i = 0; i < results.length; i++) {
              const obj = results[i];
              if (obj.subMetatags) {
                this.createMapServices(obj.subMetatags.subService, 'subService', true);
              }
              if (obj.serviceMetatags) {
                this.createMapServices(obj.serviceMetatags.service, 'service', true);
              }
            }
          }

          this.searchResults = tempCollection ? tempCollection.splice(0, 3) : [];
        },
        (err: any) => {
          console.log(err);
          this.loading.next(false);
        },
        () => {
          this.loading.next(false);
        }
      );

    this.geocodingService.getJSON().subscribe(
      (data) => {
        for (const prop in data) {
          this.cities.push(data[prop] + ', ' + prop);
        }
      }
    );

    this.cityCtrl = new FormControl();
    this.filteredCities = this.cityCtrl.valueChanges
      .startWith(null)
      .map(name => this.filterCities(name));
  }

  onKeyup(value: any) {
    if (!this.cityParam) {
      this.geoEl.nativeElement.value = '';
    }
    if (this.cityParam && this.selectedCity !== this.geoEl.nativeElement.value) {
      this.clearSearchParams();
    }
  }

  onKeyupSearchService(value: any) {
    if (this.serviceParam && this.selectedCategory !== this.el.nativeElement.value) {
      this.serviceParam = null;
    }
  }

  clearSearchParams() {
    this.cityParam = null;
    this.cityCtrl.reset();
    this.currentCity = '';
    this.selectedCity = '';
    this.zipParam = null;
    this.latitudeParam = null;
    this.longitudeParam = null;
    this.distanceModel = 0;
    this.distance = 10000;
    this.distanceParam = {searchKey: 'distance', searchValue: this.distance};
    this.searchByLocation();
  }

  getLocation(city) {
    this.isLoad = true;
    this.geocodingService.search(city, 'city').subscribe(
      (resp) => {
        if (resp[0].location) {
          this.createLocationSearchObj(city, resp);
        }
      }
    );
  }

  createLocationSearchObj(city, resp) {
    if (city.indexOf(',') > 0) {
      this.selectedCity = city;
      this.currentCity = city.substring(city.indexOf(','), 0);
      this.currentZipCode = city.substring(city.indexOf(',') + 2, city.length);
      this.cityParam = {searchKey: 'city', searchValue: this.currentCity};
      this.zipParam = {searchKey: 'zipCode', searchValue: this.currentZipCode};
    } else {
      this.currentCity = city;
      this.cityParam = {searchKey: 'city', searchValue: this.currentCity};
    }

    this.latitudeParam = {searchKey: 'lat', searchValue: resp[0].location.lat};
    this.longitudeParam = {searchKey: 'lng', searchValue: resp[0].location.lng};

    this.location = {
      latitude: resp[0].location.lat,
      longitude: resp[0].location.lng,
      distance: this.distance
    };
    this.disabledSlider = false;
    this.searchByLocation();
  }

  fillSearchConfig(config?): void [] {

    this.searchParams.searchCategory = this.serviceParam;
    this.searchParams.distance = this.distanceParam;
    this.searchParams.lat = this.latitudeParam;
    this.searchParams.lng = this.longitudeParam;
    if (config) {
      this.searchParams[config.searchKey] = config;
    }
    const resultArr = [];
    for (const i in this.searchParams) {
      if (this.searchParams[i]) {
        resultArr.push(this.searchParams[i]);
      }
    }
    return resultArr;
  }

  searchByLocation() {
    this.filteredServices = [];
    this.searchConfig = this.fillSearchConfig();
    this.providerSearchService.mainSearch(this.searchConfig).subscribe(
      (resp) => {
        this.isLoad = false;
        if (resp) {
          let tempCollection;
          this.createMapServices(resp);

          tempCollection = resp.filter((item) => {
            return item.company_name;
          });

          this.searchParams.searchCity = this.cityParam;
          this.searchParams.searchZip = this.zipParam;
          this.searchResults = tempCollection;
        } else {
          this.searchResults = [];
        }
      }
    );
  }

  createMapServices(items, service?, metatags?) {
    let tempCollection;
    const uniqTempCollection = {};

    for (let i = 0; i < items.length; i++) {
      if (items[i].name) {
        this.metatagsResult.push({
          'id': items[i].id,
          'mapId': items[i].id + (service ? 'service' : 'subService'),
          'name': items[i].name,
          'type': service ? 'service' : 'subService',
          'checked': false,
          'parentId': items[i].service_id ? items[i].service_id : undefined,
          'metatags': items[i].metatags ? items[i].metatags : []
        });
      }
      if (items[i].subServices && items[i].subServices.length) {
        this.createMapServices(items[i].subServices, false);
      }
    }

    tempCollection = this.metatagsResult;
    if (metatags) {
      tempCollection = tempCollection.filter(item => {
        for (let i = 0; i < item.metatags.length; i++) {
          if (new RegExp(`${this.searchValue}`, 'gi').test(item.metatags[i].toLowerCase().trim())) {
            return true;
          }
        }
        return false;
      });
    }
    tempCollection.filter((item) => {
      for (let i = 0; i < this.providerServicesMap.length; i++) {
        if ((this.providerServicesMap[i].id === item.parentId) && this.providerServicesMap[i].type === 'service') {
          return item.parentName = this.providerServicesMap[i].name;
        }
      }
    });
    tempCollection = tempCollection.filter((item) => {
      if (!uniqTempCollection[item.id]) {
        uniqTempCollection[item.id] = true;
        return true;
      }
      return false;
    });
    if (metatags) {
      this.metatagsResult = tempCollection.splice(0, 3);
    } else {
      this.filteredServices = tempCollection.splice(0, 3);
    }
  }

  createMap(items, service?) {
    for (let i = 0; i < items.length; i++) {
      this.providerServicesMap.push({
        'id': items[i].id,
        'mapId': items[i].id + (service ? 'service' : 'subService'),
        'name': items[i].name,
        'type': service ? 'service' : 'subService',
        'checked': false,
        'parentId': items[i].service_id ? items[i].service_id : undefined
      });
      if (items[i].Subservices && items[i].Subservices.length) {
        this.createMap(items[i].Subservices, false);
      }
    }
  }

  filterServices(val) {
    let tempCollection;
    this.filteredServices = this.providerServicesMap.filter(s => new RegExp(`${val}`, 'gi').test(s.name.toLowerCase().trim()));
    tempCollection = this.filteredServices;
    tempCollection.filter((item) => {
      for (let i = 0; i < this.providerServicesMap.length; i++) {
        if ((this.providerServicesMap[i].id === item.parentId) && this.providerServicesMap[i].type === 'service') {
          return item.parentName = this.providerServicesMap[i].name;
        }
      }
    });
    this.filteredServices = tempCollection.splice(0, 3);
  }

  filterCities(val: string) {
    if (val != null && val.length > 2) {
      return val ? this.cities.filter(s => new RegExp(`${val}`, 'gi').test(s))
        : this.cities;
    }
  }

  locateUser() {
    if (navigator.geolocation) {
      this.isSearchingLocation = true;
      navigator.geolocation.getCurrentPosition(this.setPosition.bind(this), () => {
        this.isSearchingLocation = false;
      });
    }
  }

  setPosition(position) {
    this.location = position.coords;
    this.location.distance = 0;
    this.geocodingService.reverseSearch(this.location.latitude + ',' + this.location.longitude).subscribe(
      (resp) => {
        this.setCityName(resp);
      }
    );
  }

  setCityName(resp) {
    this.geoEl.nativeElement.value = resp[0].city;
    this.isSearchingLocation = false;
    const city = resp[0].city + ', ' + resp[0].zipCode;
    this.createLocationSearchObj(city, resp);
  }

  selectedDistance(event) {
    this.distanceModel = event.value;
    this.distance = this.distanceModel * 1000;
    this.distanceParam = {searchKey: 'distance', searchValue: this.distance};
    this.searchByLocation();
  }

  goToProfilePage(providerId) {
    this.router.navigate(['provider-profile', providerId]);
  }

  goToSearchResults(searchKey, value, index?) {
    this.searchValue = value;
    this.selectedCategory = value;
    this.serviceParam = {searchKey: searchKey, searchValue: value};
    this.searchResults = [];
    this.filteredServices = [];
    this.metatagsResult = [];
    this.isChoosedSearch = true;
    if (this.currentCity) {
      this.disabledSlider = false;
    }
  }

  allSearch(searchKey, value) {
    this.searchConfig.push({searchKey: searchKey, searchValue: value});
    this.router.navigate(['search-result'], {
      queryParams: {
        searchParams: JSON.stringify(this.searchConfig)
      }
    });
  }

  filteredProvider() {
    this.searchResults = this.currentProvider;
  }

  search(): void {
    if (!this.isLoad) {
      if (this.searchParams.searchText != null) {
        if (this.currentProvider.length) {
          this.filteredProvider();
        }
        if (!this.searchResults.length) {
          this.openDialog();
          this.clearSearchParams();
          return;
        }
        this.router.navigate(['search-result'], {
          queryParams: {
            searchResults: JSON.stringify(this.searchResults),
            searchParams: JSON.stringify(this.searchParams),
          }
        });
      } else {
        this.router.navigate(['search']);
      }
      if (this.providerId) {
        this.router.navigate(['provider-profile', this.providerId]);
      }
    }
  }

  changeSearch(): void {
    this.isChoosedSearch = false;
    this.disabledSlider = true;
  }

  openDialog() {
    const dialogRef = this.dialog.open(InfoDialogComponent);
    dialogRef.componentInstance.infoText = 'There are no search results matching your filtered query';
  }
}
