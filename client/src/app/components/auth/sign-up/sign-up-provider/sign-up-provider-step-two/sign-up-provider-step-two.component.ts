import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';

import { Provider } from '../../../../../shared/models/provider.model';
import { ProviderServices } from '../../../../../shared/models/provider-services.model';
import { ProviderServicesService } from '../../../../../shared/services/provider-services/provider-services.service';
import { FormUtilsService } from '../../../../../shared/forms/form-utils.service';

@Component({
  selector: 'app-sign-up-provider-step-two',
  templateUrl: './sign-up-provider-step-two.component.html',
  styleUrls: ['./sign-up-provider-step-two.component.scss']
})
export class SignUpProviderStepTwoComponent implements OnInit {

  public highlightStatus: Array<boolean> = [];
  public provider: Provider;
  public providerServices: ProviderServices[];
  public providerServicesMap = {};
  public providerServicesChecked = [];

  constructor(
    formUtils: FormUtilsService,
    private router: Router,
    private r: ActivatedRoute,
    private providerServicesService: ProviderServicesService) {
    this.provider = formUtils.provider;
  }

  ngOnInit() {
    this.getServices();
  }

  getServices() {
    this.providerServicesService.services.subscribe(
      (resp) => {
        this.providerServices = resp;
        this.createMap(resp, true);
      },
      (error) => console.log('error getting services.', error)
    );
  }

  createMap(items, service?) {
    for (let i = 0; i < items.length; i++) {
      this.providerServicesMap[items[i].id + (service ? 'service' : 'subService')] = {
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

  updateCheckedOptions(option, event, i) {
    if (this.providerServicesMap[option].type === 'service' && typeof i === 'number' && event.checked === true) {
      for (let j = 0; j < this.highlightStatus.length; j++) {
        this.highlightStatus[j] = false;
      }
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
    this.updateCheckedSubServices();
  }

  updateCheckedSubServices() {
    this.providerServicesChecked = [];
    for (let x in this.providerServicesMap) {
      if (this.providerServicesMap[x].checked && this.providerServicesMap[x].type === 'subService') {
        this.providerServicesChecked.push({
          id: this.providerServicesMap[x].id
        });
      }
    }
    this.provider.servicesMap = this.providerServicesChecked;
  }

  toggleList(event, i) {
    if (!this.highlightStatus[i]) {
      for (let j = 0; j < this.highlightStatus.length; j++) {
        this.highlightStatus[j] = false;
      }
      this.highlightStatus[i] = true;
    } else {
      this.highlightStatus[i] = false;
    }
    event.stopPropagation();
  }

  back() {
    this.router.navigate(['../step-one'], { relativeTo: this.r });
  }

  next() {
    this.router.navigate(['../step-three'], { relativeTo: this.r });
  }

}
