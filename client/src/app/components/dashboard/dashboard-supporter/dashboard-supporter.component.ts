import { Component, OnInit } from '@angular/core';

import { ProviderServicesService } from '../../../shared/services/provider-services/provider-services.service';
import { ProfileService } from '../../../shared/services/profile/profile.service';
import { ProviderCompany } from '../../../shared/models/provider-company.model';

@Component({
  selector: 'app-dashboard-supporter',
  templateUrl: './dashboard-supporter.component.html',
  styleUrls: ['./dashboard-supporter.component.scss']
})
export class DashboardSupporterComponent implements OnInit {
  private currentScreen = 0;
  public providers: Array<ProviderCompany>;
  public raters: Array<any>;

  constructor(private providerServicesService: ProviderServicesService, private profileService: ProfileService) { }

  ngOnInit() {
    this.providerServicesService.getRaters().subscribe(
      (resp) => {
        if (resp.length) {
          this.raters = resp;
          for (let i = 0; i < this.raters.length; i++) {
            this.profileService.getUser(this.raters[i].user_id).subscribe(
              (user) => {
                this.raters[i].User = user.json();
              }
            )
          }
        }
      }
    );
  }

  changeTab(id: number): void {
    this.currentScreen = id;
  }

}
