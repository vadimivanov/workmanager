import { Component, OnInit, EventEmitter, ElementRef, ViewChild, HostBinding } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';

import { ProviderSearchService } from '../../services/provider-search/provider-search.service';
import { ProviderServicesService } from '../../services/provider-services/provider-services.service';
import { GeocodingService } from '../../services/geocoding/geocoding.service';

@Component({
  selector: 'app-promo',
  templateUrl: './promo.component.html',
  styleUrls: ['./promo.component.scss']
})
export class PromoComponent implements OnInit {
  @HostBinding('class.promo') 1;
  searchResults: any = [];
  providerServicesMap = [];
  filteredServices = [];
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
  cities = [];
  cityCtrl: FormControl;
  filteredCities: any;
  disabledSlider = true;
  isSearchingLocation = false;
  loading: EventEmitter<boolean> = new EventEmitter<boolean>();
  // results: EventEmitter<SearchResult[]> = new EventEmitter<SearchResult[]>();
  @ViewChild('searchField') el: ElementRef;
  @ViewChild('geoSearchField') geoEl: ElementRef;

  constructor(
    private providerSearchService: ProviderSearchService,
    private providerServicesService: ProviderServicesService,
    private geocodingService: GeocodingService,
    private router: Router) { }

  ngOnInit() {
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
      })
      .filter((text: string) => text.length > 2)
      .debounceTime(300)
      .do((e) => {
        this.loading.next(true);
        this.filterServices(e);
      })
      .map((query: string) => this.providerSearchService.doSearch(query, ''))
      .switch()
      .subscribe(
        (results: any) => {
          this.loading.next(false);
          // this.results.next(results);
          this.searchResults = results;
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
        for (let prop in data) {
          this.cities.push(data[prop] + ', ' + prop);
        }
      },
      (error) => {
      }
    );

    this.cityCtrl = new FormControl();
    this.filteredCities = this.cityCtrl.valueChanges
      .startWith(null)
      .map(name => this.filterCities(name));
  }

  getLocation(city) {
    this.geocodingService.search(city, 'city').subscribe(
      (resp) => {
        if (resp[0].location) {
          this.location = {
            latitude: resp[0].location.lat,
            longitude: resp[0].location.lng,
            distance: this.distance
          };
          this.searchByLocation();
        }
      }
    );
  }

  searchByLocation() {
    this.filteredServices = [];
    this.location.distance = this.distance;
    this.providerSearchService.doSearch('', this.location).subscribe(
      (resp) => {
        this.disabledSlider = false;
        this.searchResults = resp;
      }
    );
  }

  createMap(items, service?) {
    for (let i = 0; i < items.length; i++) {
      this.providerServicesMap[i] = {
        'id': items[i].id,
        'mapId': items[i].id + (service ? 'service' : 'subService'),
        'name': items[i].name,
        'type': service ? 'service' : 'subService',
        'checked': false,
        'parentId': items[i].service_id ? items[i].service_id : undefined
      };
      if (items[i].Subservices && items[i].Subservices.length) {
        this.createMap(items[i].Subservices, false);
      }
    }
  }

  filterServices(val) {
    this.filteredServices = this.providerServicesMap.filter(s => new RegExp(`${val}`, 'gi').test(s.name));
  }

  filterCities(val: string) {
    return val ? this.cities.filter(s => new RegExp(`^${val}`, 'gi').test(s))
      : this.cities;
  }

  locateUser() {
    if (navigator.geolocation) {
      this.isSearchingLocation = true;
      navigator.geolocation.getCurrentPosition(this.setPosition.bind(this));
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
    this.searchByLocation();
  }

  setCityName(resp) {
    this.geoEl.nativeElement.value = resp[0].city;
    this.isSearchingLocation = false;
  }

  selectedDistance(event) {
    this.distance = (event.value) * 1000;
    this.searchByLocation();
  }

  goToProfilePage(id) {
    this.router.navigate(['provider-profile', id]);
  }

  goToSearchResults(data) {
    console.log(data);
    // load results page
  }
}
