import { Component, OnInit, HostBinding, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Response } from '@angular/http';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';

import { ProfileService } from '../../services/profile/profile.service';
import { ProviderSearchService } from '../../services/provider-search/provider-search.service';
import { ProviderServicesService } from '../../services/provider-services/provider-services.service';
import { AuthGroup } from '../../models/auth-group';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [
    trigger('searchState', [
      state('inactive', style({
        display: 'none',
        left: '2px',
        right: '2px',
        opacity: '0',
      })),
      state('active',   style({
        left: '2px',
        right: '2px',
        display: 'block',
        opacity: '1',
      })),
      transition('inactive => active', animate('150ms ease-in'))
    ])
  ],
  host: {
    '(document:click)': 'onClick($event)',
  }
})

export class HeaderComponent extends AuthGroup implements OnInit {
  @HostBinding('class.header') 1;

  isMenuOpen = false;
  currentUserName: string;
  currentUserImg: string;
  userData: any;
  searchConfig: any = [];
  searchValue: string = '';
  providerId: number;
  isChoosedSearch = false;

  metatagsResult = [];
  currentProvider = [];
  filteredServices: any = [];
  providerServicesMap = [];
  searchResults: any = [];
  @ViewChild('headerSearch') el: ElementRef;
  loading: EventEmitter<boolean> = new EventEmitter<boolean>();
  animateState = 'inactive';
  subscription: Subscription;
  currentRole = {
    Rater: () => {
      this.isRater = true;
      this.profileRoute = 'rater-profile';
      this.feedbackRoute = 'feedback';
      this.dashboardRoute = 'dashboard-rater';
    },
    Provider: () => {
      this.isProvider = true;
      this.profileRoute = 'provider-profile';
      this.dashboardRoute = 'dashboard-provider';
    },
    Admin: () => {
      this.isSupporter = true;
      this.dashboardRoute = 'dashboard-supporter';
    },
    Unregister: () => {
      this.isUnregister = true;
      this.feedbackRoute = 'register/provider';
    },
  };

  constructor(
    private router: Router,
    private profileService: ProfileService,
    private providerSearchService: ProviderSearchService,
    private providerServicesService: ProviderServicesService,
    authService: AuthService,
    private _eref: ElementRef
  ) {
    super(authService);
    this.subscription = this.profileService.getUpdatedUser().subscribe(
      message => {
        this.setCurrentRole();
      });

  }

  ngOnInit() {
    this.setCurrentRole();

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
          let tempCollection;
          this.loading.next(false);
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
          this.loading.next(false);
        },
        () => {
          this.loading.next(false);
        }
      );
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

  goToProfilePage(providerId) {
    this.router.navigate(['provider-profile', providerId]);
  }

  goToSearchResults(searchKey, value, index?) {
    this.searchValue = value;
    this.searchConfig.push({searchKey: searchKey, searchValue: value});
    this.searchResults = [];
    this.filteredServices = [];
    this.metatagsResult = [];
    this.isChoosedSearch = true;
  }

  filteredProvider() {
    this.searchResults = this.currentProvider;
  }

  allSearch(searchKey, value) {
    this.searchConfig.push({searchKey: searchKey, searchValue: value});
    this.router.navigate(['search-result'], {
      queryParams: {
        searchParams: JSON.stringify(this.searchConfig)
      }
    });
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

  toggleAnimateState() {
    this.animateState = this.animateState === 'active' ? 'inactive' : 'active';
  }

  onClick(event) {
    // if (!this._eref.nativeElement.contains(event.target)) {
    //   this.animateState = 'inactive';
    // }
  }

  animationStarted(event) {
    if (event.toState === 'inactive') {
      this.searchResults = [];
      this.filteredServices = [];
    }
  }

  animationDone(event) {
    const searchInput = this.el.nativeElement;
    searchInput.focus();
    searchInput.value = '';
  }

  getCurrentUserInfo() {
    this.profileService.getUserRoleData(this.currentUser.user.id, this.currentUser.user.role.toLowerCase())
      .map((response: Response) => response.json())
      .subscribe((data) => {
        if (data) {
          this.currentUserName = data.company_name ? data.company_name : `${data.first_name} ${data.last_name}`;
          this.currentUserImg = data.photo_url ? data.photo_url : 'assets/images/content/img-avatar.png';
        }
      });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  setCurrentRole() {
    this.userData = this.currentUser ? Object.keys(this.currentUser) : [];
    if (this.userData.length === 0) {
      this.currentRole['Unregister']();
    } else if (this.userData.length && this.currentUser.user.role) {
      this.currentRole[this.currentUser.user.role]();
    }
    if (this.userData.length && this.currentUser.user.id && this.currentUser.user.role) {
      this.getCurrentUserInfo();
    }
  }

  goToProfile() {
    this.router.navigate([this.profileRoute]);
  }

  goToDashboard() {
    this.router.navigate([this.dashboardRoute]);
  }

  goTo() {
    this.router.navigate([this.feedbackRoute]);
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUser = null;
    this.router.navigate(['home']);
    this.setCurrentRole();
  }
}
