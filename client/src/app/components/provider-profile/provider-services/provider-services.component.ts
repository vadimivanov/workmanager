import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';

import { ProfileService } from '../../../shared/services/profile/profile.service';
import { Provider } from '../../../shared/models/provider.model';
import { ProviderServices } from '../../../shared/models/provider-services.model';
import { ProviderServicesService } from '../../../shared/services/provider-services/provider-services.service';
import { FormUtilsService } from '../../../shared/forms/form-utils.service';
import { AuthGroup } from '../../../shared/models/auth-group';
import { AuthService } from '../../../shared/services/auth/auth.service';

@Component({
  selector: 'app-provider-services',
  templateUrl: './provider-services.component.html',
  styleUrls: ['./provider-services.component.scss']
})
export class ProviderServicesComponent extends AuthGroup implements OnInit, OnDestroy {

  public highlightStatus: Array<boolean> = [];
  public provider: Provider;
  public providerServices: ProviderServices[];
  public providerServicesMap = {};
  public providerServicesChecked = [];

  userData = [];
  providerSubServices = [];
  providerSubServicesArr = [];
  currentUserData: any = {};
  userId: number;
  userRole: string;
  isUnregister: boolean = false;
  isSupporter: boolean = false;
  isRater: boolean = false;
  isProvider: boolean = false;
  visitorRole: string;
  subRouterParamsChange: any;

  currentRole = {
    Rater: () => {
      this.isRater = true;
    },
    Provider: () => {
      this.userId = this.currentUserData.user.id;
      this.userRole = this.currentUserData.user.role.toLowerCase();
      if (this.userId === this.currentUser.user.id) {
        this.isProvider = true;
        this.visitorRole = 'provider';
      }
    },
    Unregister: () => {
      this.isUnregister = true;
    },
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    formUtils: FormUtilsService,
    private profileService: ProfileService,
    private providerServicesService: ProviderServicesService,
    authService: AuthService
  ) {
    super(authService);
    this.provider = formUtils.provider;
  }

  ngOnInit() {
    this.subRouterParamsChange = this.route.params.subscribe(params => {
      if (params && this.currentUser && this.currentUser.user
        && params.id === this.currentUser.user.id) {

        this.isProvider = true;
      } else {
        this.isProvider = false;
      }

      this.providerServices = [];
      this.providerServicesMap = {};
      this.providerSubServicesArr = [];

      this.getServices();
      this.getCurrentUser();
    });
  }

  ngOnDestroy() {
    if (this.subRouterParamsChange) {
      this.subRouterParamsChange.unsubscribe();
    }
  }

  getCurrentUser() {
    if (this.router.url === '/provider-profile') {
      this.currentUserData = this.currentUser;
      this.getCurrentUserData();
    } else {
      this.userId = this.route.snapshot.params['id'];
      this.getUser();
    }
  }

  getVisitorRole() {
    if (this.currentUser.user && this.currentUser.user.role !== 'Admin') {
      this.currentRole[this.currentUser.user.role]();
    } else if (this.currentUser.user && this.currentUser.user.role) {
      this.currentRole['Unregister']();
    }
  }

  getCurrentUserData() {
    this.getVisitorRole();
    if (this.currentUserData) {
      this.getSubServices();
    }
  }

  getUser() {
    this.profileService.getUser(this.userId).subscribe(
      (resp) => {
        if (JSON.parse(resp._body)) {
          this.currentUserData = {user: JSON.parse(resp._body)};
          this.userRole = this.currentUserData.user.role.toLowerCase();
          this.getCurrentUserData();
        }
      }
    );

  }

  getServices() {
    this.providerServicesService.services.subscribe(
      (resp) => {
        this.providerServices = resp;
        this.createMap(resp, true);
      }
    );
  }

  getSubServices() {
    this.providerServicesService.getProvidersSubservices(this.userId).subscribe(
      (resp) => {
        this.providerSubServicesArr = [];
        if (resp && resp.length) {
          const temp = [];
          this.providerSubServices = resp;
          for (let i = 0; i < this.providerSubServices.length; i++) {
            const obj = this.providerSubServices[i];
            if (temp.indexOf(obj.service_id) < 0) {
              temp.push(obj.service_id);
              this.providerSubServicesArr.push(
                {
                  service_id: obj.service_id,
                  name: obj.service,
                  subservices: []
                }
              );
            }
          }
          this.providerSubServicesArr.forEach(function(item) {
            resp.forEach(function(element) {
              if (item.service_id === element.service_id) {
                if (temp.indexOf(element.service_id) >= 0) {
                  item.subservices.push({
                    name: element.name,
                    id: element.id
                  });
                }
              }
            });
          });
          this.checkStatusCategoriesSubcategories();
        }
      }
    );
  }

  setChecked(type, id) {
    const tempColection = this.providerSubServices.filter(function(sub){
      return type === 'service' ? sub.service_id === id : sub.id === id;
    });
    return !!tempColection.length;
  }

  createMap(items, service?) {
    for (let i = 0; i < items.length; i++) {
      this.providerServicesMap[items[i].id + (service ? 'service' : 'subService')] = {
        'id': items[i].id,
        'mapId': items[i].id + (service ? 'service' : 'subService'),
        'name': items[i].name,
        'type': service ? 'service' : 'subService',
        'checked': this.setChecked(service ? 'service' : 'subService', service ? items[i].service_id : items[i].id),
        'parentId': items[i].service_id ? items[i].service_id : undefined
      };
      if (items[i].Subservices && items[i].Subservices.length) {
        this.createMap(items[i].Subservices, false);
      }
    }
  }

  checkStatusCategoriesSubcategories() {
    for (let element in this.providerSubServicesArr) {
      for (let service in this.providerServicesMap) {
        if (this.providerSubServicesArr[element].service_id === this.providerServicesMap[service].id
          && this.providerServicesMap[service].type === 'service') {
          this.providerServicesMap[service].checked = true;
        }
      }
      for (let subservices in this.providerServicesMap) {
        for (let subelement in this.providerSubServicesArr[element].subservices) {
          if (this.providerSubServicesArr[element].subservices[subelement].id === this.providerServicesMap[subservices].id
            && this.providerServicesMap[subservices].type === 'subService') {
            this.providerServicesMap[subservices].checked = true;
          }
        }
      }
    }
  }

  updateCheckedOptions(option, event, i) {
    if (this.providerServicesMap[option].type === 'service' && i && event.checked === true) {
      this.highlightStatus[i] = true;
    }
    this.providerServicesMap[option].checked = event.checked;
    if (this.providerServicesMap[option].type === 'service') {
      for (let x in this.providerServicesMap) {
        if (this.providerServicesMap[x].type === 'subService' &&
          this.providerServicesMap[x].parentId === this.providerServicesMap[option].id) {
          this.providerServicesMap[x].checked = event.checked;
        }
      }
    }
    let resultArr = [];
    let checkArray = 0;
    if (this.providerServicesMap[option].type === 'subService') {
      for (let x in this.providerServicesMap) {
        if (this.providerServicesMap[x].type === 'service' &&
          this.providerServicesMap[x].id === this.providerServicesMap[option].parentId && event.checked === true) {
          this.providerServicesMap[x].checked = true;
        } else if (this.providerServicesMap[x].type === 'service' &&
          this.providerServicesMap[x].id === this.providerServicesMap[option].parentId && event.checked === false) {
          for (let y in this.providerServicesMap) {
            if (this.providerServicesMap[y].type === 'subService' &&  this.providerServicesMap[y].parentId === this.providerServicesMap[option].parentId) {
              resultArr.push(this.providerServicesMap[y].checked);
            }
          }
          for (let i in resultArr) {
            if (!resultArr[i]) {
              checkArray++;
            }
          }
          if (checkArray === resultArr.length) {
            this.providerServicesMap[x].checked = false;
          }
        }
      }
    }
  }

  updateCheckedSubServices() {
    for (let x in this.providerServicesMap) {
      if (this.providerServicesMap[x].checked && this.providerServicesMap[x].type === 'subService') {
        this.providerServicesChecked.push({
          id: this.providerServicesMap[x].id
        });
      }
    }
  }

  updateServices() {
    this.updateCheckedSubServices();
    this.providerServicesService.setProvidersSubservices(this.userId, this.providerServicesChecked).subscribe(
      (resp) => {
        this.getSubServices();
      }
    );
  }

  toggleList(event, i) {
    this.highlightStatus[i] = !this.highlightStatus[i];
    event.stopPropagation();
  }
}
