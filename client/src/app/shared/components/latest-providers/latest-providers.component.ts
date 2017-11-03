import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ProviderServicesService } from '../../services/provider-services/provider-services.service';
import { ProviderCompany } from '../../models/provider-company.model';

@Component({
  selector: 'app-latest-providers',
  templateUrl: './latest-providers.component.html',
  styleUrls: ['./latest-providers.component.scss']
})
export class LatestProvidersComponent implements OnInit {
  private companyList: Array<ProviderCompany> = [];
  private currentLimit: number = 4;
  private currentOffset: number = 0;

  constructor(private providerServicesService: ProviderServicesService, private router: Router) { }

  ngOnInit() {
    this.getProviders();
  }

  getProviders() {
    this.providerServicesService.getProviders(this.currentLimit, this.currentOffset).subscribe(
      (resp) => {
        this.companyList = resp;
        this.getProvidersSubservices();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getProvidersSubservices() {
    for (let i = 0; i < this.companyList.length; i++) {
      this.providerServicesService.getProvidersSubservices(this.companyList[i].user_id).subscribe(
        (resp) => {
          if (resp && resp.length) {
            this.companyList[i].subServices = resp.splice(0, 4);
          }
        }
      );
    }
  }

  goToProfile(id) {
    this.router.navigate(['provider-profile', id]);
  }

}
