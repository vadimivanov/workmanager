import { Component, OnInit, EventEmitter, ElementRef, ViewChild, HostBinding } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';

import { ProviderSearchService } from '../../shared/services/provider-search/provider-search.service';
import { ProviderServicesService } from '../../shared/services/provider-services/provider-services.service';

@Component({
  selector: 'app-how-it-works-rater',
  templateUrl: './how-it-works-rater.component.html',
  styleUrls: ['./how-it-works-rater.component.scss']
})
export class HowItWorksRaterComponent implements OnInit {
  searchResults: any = [];
  searchConfig: any = [];
  searchValue: string = '';
  providerId: number;
  isChoosedSearch = false;
  providerServicesMap = [];
  metatagsResult = [];
  currentProvider = [];
  filteredServices = [];
  filteredCities: any;
  disabledSlider = true;
  isSearchingLocation = false;
  loading: EventEmitter<boolean> = new EventEmitter<boolean>();
  // results: EventEmitter<SearchResult[]> = new EventEmitter<SearchResult[]>();
  @ViewChild('searchField') el: ElementRef;
  constructor(
    private providerSearchService: ProviderSearchService,
    private providerServicesService: ProviderServicesService,
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
          let tempCollection;
          if (results._body) {
            tempCollection = JSON.parse(results._body).filter((item) => {
              return item.company_name;
            });
          }
          if (results.length) {
            tempCollection = results.filter((item) => {
              return item.company_name;
            });
          }
          for (let i = 0; i < results.length; i++) {
            let obj = results[i];
            if (obj.subMetatags) {
              this.createMapServices(obj.subMetatags.subService, 'subService', true);
            }
            if (obj.serviceMetatags) {
              this.createMapServices(obj.serviceMetatags.service, 'service', true);
            }
          }
          this.searchResults = tempCollection ? tempCollection.splice(0, 5) : [];
        },
        (err: any) => {
          console.log(err);
          this.loading.next(false);
        },
        () => {
          this.loading.next(false);
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
      this.metatagsResult = tempCollection.splice(0, 5);
    } else {
      this.filteredServices = tempCollection.splice(0, 5);
    }
  }

  createMap(items, service?) {
    let tempCollection;
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

  goToProfilePage(providerId) {
    this.router.navigate(['provider-profile', providerId]);
  }

  goToSearchResults(searchKey, value, index?) {
    this.searchValue = value;
    this.searchConfig.push({searchKey: searchKey, searchValue: value});
    this.searchResults = [];
    this.filteredServices = [];
    this.isChoosedSearch = true;
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
    if (this.searchConfig.length) {
      if (this.currentProvider.length) {
        this.filteredProvider();
      }
      this.router.navigate(['search-result'], {
        queryParams: {
          searchResults: JSON.stringify(this.searchResults),
          searchParams: JSON.stringify(this.searchConfig)
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
