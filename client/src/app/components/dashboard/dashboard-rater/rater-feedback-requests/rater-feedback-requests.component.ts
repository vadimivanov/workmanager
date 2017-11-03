import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ProfileService } from '../../../../shared/services/profile/profile.service';
import { ProviderServicesService } from '../../../../shared/services/provider-services/provider-services.service';
import { FormUtilsService } from '../../../../shared/forms/form-utils.service';
import { Rater } from '../../../../shared/models/rater.model';
import { PagerService } from '../../../../shared/services/pager/pager.service';
import { RATING } from '../../../../shared/constants';
import { STATUSES } from '../../../../shared/constants';

@Component({
  selector: 'app-rater-feedback-requests',
  templateUrl: './rater-feedback-requests.component.html',
  styleUrls: ['./rater-feedback-requests.component.scss']
})
export class RaterFeedbackRequestsComponent implements OnInit {

  public rater: Rater;
  feedbacksList: any[];
  feedbacksStatuses = STATUSES;
  services: any[];
  isRater = false;
  // array of all items to be paged
  private allItems: any[];

  // pager object
  pager: any = {};

  // paged items
  pagedItems: any[];
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    formUtils: FormUtilsService,
    private pagerService: PagerService,
    private providerServicesService: ProviderServicesService,
    private profileService: ProfileService) {
    this.rater = formUtils.rater;
  }

  ngOnInit() {
    this.getFeedbacks();
    this.getVisitorRole();
  }

  getVisitorRole() {
    this.isRater = this.rater.id ? true : false;
  }

  getFeedbacks() {
    this.profileService.getFeedbackRequests(this.rater.id, 'rater').subscribe(
      (response) => {
        if (response._body) {
          this.feedbacksList = JSON.parse(response._body);
          this.allItems = this.feedbacksList;
          this.getServices();
          this.setPage(1);
        } else {
          this.pagedItems = [];
          this.feedbacksList = null;
        }
      }
    );
  }

  getServices() {
    this.providerServicesService.services.subscribe(
      (resp) => {
        this.services = resp;
        for (let i = 0; i < this.feedbacksList.length; i++) {
          for (let j = 0; j < this.services.length; j++) {
            const obj = this.feedbacksList[i];
            const service = this.services[j];
            if (obj.service_id === service.id) {
              obj.service_name = service.name;
            }
          }
        }
      }
    );
  }

  selectingFeedbacks(event, type) {
    if (type === 'service') {
      if (event.value === '0') {
        this.allItems = this.feedbacksList;
      } else {
        this.allItems = this.feedbacksList.filter(function(feedback) {
          return feedback.service_id === +event.value;
        });
      }
    }
    if (type === 'status') {
      this.allItems = this.feedbacksList.filter(function(feedback) {
        return event.value ? feedback[event.value] : feedback;
      });
    }
    this.setPage(1);
  }

  setPage(page: number) {
    if (page < 1) {
      return;
    }

    // get pager object from service
    this.pager = this.pagerService.getPager(this.allItems.length, page);

    // get current page of items
    this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  aproveRequest(feedback) {
    this.router.navigate(['feedback'], {queryParams: {feedback: JSON.stringify(feedback)}});
  }

  removeRequest(feedId) {
    this.profileService.removeFeedbackRequest(this.rater.id, 'rater', feedId).subscribe(
      (response) => {
        this.getFeedbacks();
      }
    );
  }
}
