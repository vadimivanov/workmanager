import { Component, OnInit, Input, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { ProviderSearchService } from '../../../shared/services/provider-search/provider-search.service';
import { ProviderServicesService } from '../../../shared/services/provider-services/provider-services.service';
import { GeocodingService } from '../../../shared/services/geocoding/geocoding.service';
import {
  FormBuilder,
  FormGroup,
  FormControl
} from '@angular/forms';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit {

  searchResults: any;
  searchConfig: any;
  searchValue = '';
  queryParams: any;
  providerSubServicesArr: Array<any> = [];
  providerServices: Array<any> = [];
  searchParams = {
    searchValue: this.searchValue,
    searchText: null,
    searchCity: null,
    searchZip: null,
    searchCategory: null,
    minRating: null,
    maxRating: null,
    distance: null,
    lat: null,
    lng: null
  };
  states = [
    {
      name: 'Standard',
      value: 'plan'
    }, {
      name: 'Bewertung',
      value: 'rating'
    }
  ];
  distance = 10000;
  searchCityParam: any = '';
  sliderValue: number = 0;
  filteredCities: any;
  disabledSlider = true;
  isSearchingLocation = false;
  stateToggleValue = false;
  isItemOpen: Array<boolean> = [];
  form2: FormGroup;
  formSlider: FormGroup;
  cities = [];
  cityCtrl: FormControl;
  currentCity = '';
  currentZipCode = '';
  selectedCity = '';

  @ViewChild('searchField') el: ElementRef;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private providerSearchService: ProviderSearchService,
    private providerServicesService: ProviderServicesService,
    private geocodingService: GeocodingService
  ) { }

  stateToggle() {
    this.stateToggleValue = !this.stateToggleValue;
  }

  ngOnInit() {
    this.searchParams.distance = {searchKey: 'distance', searchValue: this.distance};
    this.queryParams = this.route.queryParams;
    this.searchResults = this.queryParams._value.searchResults ? JSON.parse(this.queryParams._value.searchResults) : [];
    this.providerServices = this.queryParams._value.providerServices ? JSON.parse(this.queryParams._value.providerServices) : [];
    this.searchParams = this.queryParams._value.searchParams ? JSON.parse(this.queryParams._value.searchParams) : null;
    this.form2 = this.fb.group({
      range: [[0, 5]],
      rating: 0
    });
    this.formSlider = this.fb.group({
      range: {
        'min': 0,
        'max': 100
      }
    });
    if (this.searchResults) {
      this.getServicesResult();
    }
    if (this.searchParams && this.searchParams.searchCity != null && this.searchParams.searchCity.searchValue.length) {
      this.searchCityParam = this.searchParams.searchCity.searchValue + ', ' + this.searchParams.searchZip.searchValue;
    }
    if (this.searchParams && this.searchParams.distance != null && this.searchParams.distance.searchValue) {
      this.sliderValue = this.searchParams.distance.searchValue / 1000;
    }
    if (this.searchParams && !this.searchResults.length) {
      this.search();
    }

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

  onChanges(event, searchKey) {
    this.searchParams.minRating = {searchKey: 'minRating', searchValue: event[0]};
    this.searchParams.maxRating = {searchKey: 'maxRating', searchValue: event[1]};
    this.search();
  }

  onKeyup(value: any) {
    if (this.searchParams.searchCity === null) {
      this.el.nativeElement.value = '';
    }
    if (this.searchParams.searchCity && this.selectedCity != this.el.nativeElement.value) {
      this.clearSearchParams();
    }
  }

  chooseCategory(category, searchKey): void {
    this.searchParams.searchCategory = {searchKey: searchKey, searchValue: category};
    this.search();
    event.stopPropagation();
  }

  accordionToggle(event, i) {
    event.stopPropagation();
    this.isItemOpen[i] = !this.isItemOpen[i];
  }

  fillSearchConfig(): void [] {
    const resultArr = [];
    for (const i in this.searchParams) {
      if (this.searchParams[i] && i !== 'searchCity' && i !== 'searchZip') {
        resultArr.push(this.searchParams[i]);
      }
    }
    return resultArr;
  }

  clearSearchParams() {
    this.el.nativeElement.value = '';
    this.searchParams.searchCity = null;
    this.searchParams.searchZip = null;
    this.searchParams.distance = {searchKey: 'distance', searchValue: this.distance};
    this.searchParams.lat = null;
    this.searchParams.lng = null;
    this.search();
  }

  search(input?): void {
    if (input && input.value.length) {
      this.searchParams.searchText = {searchKey: 'searchText', searchValue: input.value};
    }
    if (input && !input.value.length) {
      this.searchParams.searchText = null;
    }
    this.searchConfig = this.fillSearchConfig();
    this.providerSearchService.mainSearch(this.searchConfig).subscribe(
      (resp) => {
        if (resp) {
          this.searchResults = resp;
          this.providerSubServicesArr = [];
          this.getServicesResult();
        } else {
          this.searchResults = [];
        }
      },
      (error) => {
        this.searchResults = [];
        this.providerSubServicesArr = [];
      }
    );
  }

  unique(data): void [] {
    return data.filter(function (value, index, self) {
      return self.indexOf(value) === index;
    });
  }
  getServicesResult(): void {
    // need refactor
    const temp = [];
    const tempSubServices = [];
    for (let i = 0; i < this.searchResults.length; i++) {
      let obj = this.searchResults[i];
      tempSubServices.push(obj.subServices);
    }
    for (let j = 0; j < tempSubServices.length; j++) {
      let obj2: any = tempSubServices[j];
      for (let i = 0; i < obj2.length; i++) {
        let obj1 = obj2[i];
        temp.push(obj1.service_id);
      }
    }
    const filteredSubServices = this.unique(temp);
    for (let j = 0; j < tempSubServices.length; j++) {
      let obj2: any = tempSubServices[j];
      for (let i = 0; i < obj2.length; i++) {
        let obj1 = obj2[i];
        if (filteredSubServices.indexOf(obj1.service_id) >= 0) {
          filteredSubServices.splice(filteredSubServices.indexOf(obj1.service_id), 1);
          this.providerSubServicesArr.push(
            {
              service_id: obj1.service_id,
              name: obj1.Service.name,
              subservices: []
            });
        }
      }
    }
    this.providerSubServicesArr.forEach(function(item) {
      tempSubServices.forEach(function(element) {
        for (let i = 0; i < element.length; i++) {
          let elemItem = element[i];
          if (item.service_id === elemItem.service_id) {
            if (item.subservices.indexOf(elemItem.name) < 0) {
              item.subservices.push(elemItem.name);
            }
          }
        }
      });
    });
  }

  getLocation(city) {
    this.geocodingService.search(city, 'city').subscribe(
      (resp) => {
        if (resp[0].location) {
          this.selectedCity = city;
          this.currentCity = city.substring(city.indexOf(','), 0);
          this.currentZipCode = city.substring(city.indexOf(',') + 2, city.length);
          this.searchParams.searchCity = {searchKey: 'city', searchValue: this.currentCity};
          this.searchParams.searchZip = {searchKey: 'zipCode', searchValue: this.currentZipCode};

          this.searchParams.lat = {searchKey: 'lat', searchValue: resp[0].location.lat};
          this.searchParams.lng = {searchKey: 'lng', searchValue: resp[0].location.lng};
          this.disabledSlider = false;
          this.search();
        }
      }
    );
  }

  filterCities(val: string) {
    if (val != null && val.length > 2) {
      return val ? this.cities.filter(s => new RegExp(`${val}`, 'gi').test(s))
        : this.cities;
    }
  }

  selectedDistance(event): void {
    this.searchParams.distance = {searchKey: 'distance', searchValue: (event) * 1000};
    this.sliderValue = event;
    this.search();
  }

  selectingProviders(sortType): void {
    if (sortType === 'rating') {
      this.searchResults.sort(function(a, b) {
        return b.rating - a.rating;
      });
    }
    if (sortType === 'plan') {
      this.searchResults.sort(function(a, b) {
        return b.stripe_subscription.plan.id > a.stripe_subscription.plan.id ? 1 : -1;
      });
    }
  }
}
