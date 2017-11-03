import { Component, OnInit } from '@angular/core';

import { ProfileService } from '../../../shared/services/profile/profile.service';
import { FormUtilsService } from '../../../shared/forms/form-utils.service';
import { Provider } from '../../../shared/models/provider.model';
import { Visit } from '../../../shared/models/visit.model';
import { AuthService } from '../../../shared/services/auth/auth.service';

@Component({
  selector: 'app-dashboard-provider',
  templateUrl: './dashboard-provider.component.html',
  styleUrls: ['./dashboard-provider.component.scss']
})
export class DashboardProviderComponent implements OnInit {
  public provider: Provider;
  currentScreen = 0;
  public visits: Array<Visit>;
  public checkPlanName: string;

  constructor(
    formUtils: FormUtilsService,
    private profileService: ProfileService,
    private authService: AuthService) {
    this.provider = formUtils.provider;
  }

  ngOnInit() {
    this.checkPlanName = this.authService.getUser().user.stripe_subscription.plan.name;
    this.profileService.getUserRoleData(this.authService.getUser().user.id, 'provider').subscribe(
      (item) => {
        if (item && item.json()) {
          item = item.json().contact_person_info;
          this.provider.firstName = item.first_name;
          this.provider.lastName = item.last_name;
          this.provider.gender = item.gender;
          this.provider.email = item.contactEmail;
          this.provider.telNo = item.workPhone;
          this.provider.photoUrl = item.photo_url;
        }
      }
    );

    this.profileService.getStatistics(this.authService.getUser().user.id).subscribe(
      (resp) => {
        this.visits = resp;
      }
    );
  }

  changeTab(id: number): void {
    this.currentScreen = id;
  }

}
