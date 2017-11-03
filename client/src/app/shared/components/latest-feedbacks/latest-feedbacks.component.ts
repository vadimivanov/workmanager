import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';

import { ProviderServicesService } from '../../services/provider-services/provider-services.service';
import { ProfileService } from '../../services/profile/profile.service';

@Component({
  selector: 'app-latest-feedbacks',
  templateUrl: './latest-feedbacks.component.html',
  styleUrls: ['./latest-feedbacks.component.scss']
})
export class LatestFeedbacksComponent implements OnInit {
  private feedbacksList: Array<any>;
  MAX_COMMENT_LENGHT = 259;

  constructor(private providerServicesService: ProviderServicesService,
              private profileService: ProfileService,
              private router: Router) {
  }

  ngOnInit() {
    this.getServices();
  }

  getServices() {
    this.providerServicesService.getFeedbacks().subscribe(
      (resp) => {
        if (resp.length) {
          this.feedbacksList = resp.filter((item) => {
            return item.rating > 3;
          }).slice(0, 3).map((item) => {
            item.job_description = item.job_description.length > this.MAX_COMMENT_LENGHT ?
              item.job_description.slice(0, this.MAX_COMMENT_LENGHT) + '...' :
              item.job_description;
            item.providerName = item.Provider.company_name;
            return item;
          });
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  loadProviderProfile(id) {
    this.router.navigate(['provider-profile', id]);
  }

}
