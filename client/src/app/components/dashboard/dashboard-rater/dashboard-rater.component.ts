import { Component, OnInit } from '@angular/core';

import { ProfileService } from '../../../shared/services/profile/profile.service';
import { FormUtilsService } from '../../../shared/forms/form-utils.service';
import { Rater } from '../../../shared/models/rater.model';
import { AuthService } from '../../../shared/services/auth/auth.service';

@Component({
  selector: 'app-dashboard-rater',
  templateUrl: './dashboard-rater.component.html',
  styleUrls: ['./dashboard-rater.component.scss']
})
export class DashboardRaterComponent implements OnInit {
  public rater: Rater;
  currentScreen = 0;
  constructor(
    formUtils: FormUtilsService,
    private profileService: ProfileService,
    private authService: AuthService) {
    this.rater = formUtils.rater;
  }

  ngOnInit() {
    this.profileService.getUserRoleData(this.authService.getUser().user.id, 'rater').subscribe(
      (item) => {
        const raterData = item.json();
        this.rater.id = this.authService.getUser().user.id;
        this.rater.about = raterData.about;
        this.rater.email = this.authService.getUser().user.email;
        this.rater.city = raterData.city;
        this.rater.first_name = raterData.first_name;
        this.rater.last_name = raterData.last_name;
        this.rater.occupation = raterData.occupation;
        this.rater.photo_url = raterData.photo_url;
      }
    );
  }

  changeTab(id: number): void {
    this.currentScreen = id;
  }
}
