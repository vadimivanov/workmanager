import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MdDialog, MdDialogRef } from '@angular/material';

import { ProfileService } from '../../shared/services/profile/profile.service';
import { ProviderServicesService } from '../../shared/services/provider-services/provider-services.service';
import { PagerService } from '../../shared/services/pager/pager.service';
import { User } from '../../shared/models/user.model';
import { lory } from 'lory.js';
import { CreateReportProblemComponent } from '../../shared/components/modals/create-report-problem/create-report-problem.component';

@Component({
  selector: 'app-rater-profile',
  templateUrl: './rater-profile.component.html',
  styleUrls: ['./rater-profile.component.scss']
})
export class RaterProfileComponent implements OnInit {
  userId: number;
  userRole: string;
  socialData = {};
  feedbacksList = [];
  services = [];
  filteredServices = [];
  currentUserData: User;
  currentRater = {};
  states = [];
  emptyMsg: string;

  // array of all items to be paged
  private allItems: any[];

  // pager object
  pager: any = {};

  // paged items
  pagedItems: any[];

  constructor(
    public dialog: MdDialog,
    private router: Router,
    private route: ActivatedRoute,
    private profileService: ProfileService,
    private providerServicesService: ProviderServicesService,
    private pagerService: PagerService) {
  }

  ngOnInit() {
    this.socialData = {
      link: 'https://angular.io/',
      title: 'angular',
      name: 'google-plus'
    };
    this.getCurrentUser();
    this.states = [
      {
        code: 1,
        name: 'State 1'
      },
      {
        code: 2,
        name: 'State 2'
      },
      {
        code: 3,
        name: 'State 3'
      }
    ];
  }

  getCurrentUser(): void {
    if (this.router.url === '/rater-profile') {
      this.currentUserData = JSON.parse(localStorage.getItem('currentUser'));
      this.userId = this.currentUserData.user.id;
      this.userRole = this.currentUserData.user.role.toLowerCase();
      this.getCurrentUserData();

    } else {
      this.userId = this.route.snapshot.params['id'];
      this.getUser();
    }

  }

  getCurrentUserData(): void {
    if (this.currentUserData) {
      this.getRater();
      this.getFeedbacks();
    }
  }

  getUser(): void {
    this.profileService.getUser(this.userId).subscribe(
      (resp) => {
        this.currentUserData = JSON.parse(resp._body);
        this.userRole = this.currentUserData.role.toLowerCase();
        this.getCurrentUserData();
      },
      (error) => console.log('error - getUser', error)
    );
  }

  getRater(): void {
    this.profileService.getUserRoleData(this.userId, this.userRole).subscribe(
      (resp) => {
        if (resp) {
          this.currentRater = JSON.parse(resp._body);
        }
      },
      (error) => console.log('error - getRater', error)
    );
  }

  getFeedbacks(): void {
    this.profileService.getFeedback(this.userId, this.userRole).subscribe(
      (resp) => {
        if (resp._body) {
          this.feedbacksList = JSON.parse(resp._body);
          this.fillFeedbacksList();
        } else {
          this.emptyMsg = 'No feedbacks';
        }

      },
      (error) => console.log('error - getFeedback', error)
    );
  }

  fillFeedbacksList(): void {
    for (let i = 0; i < this.feedbacksList.length; i++) {
      const obj = this.feedbacksList[i];

      if (obj.Provider != null) {
        const provider = obj.Provider;

        obj.rating = ((obj.quality_of_friendliness + obj.quality_of_price + obj.quality_of_timeschedule + obj.quality_of_work) / 4);
        obj.provider_photo_url = provider.photo_url;
        obj.provider_company_name = provider.company_name;
        obj.provider_id = provider.id;
        obj.provider_role = 'provider';
      }
    }
    this.allItems = this.feedbacksList;
    this.getServices();
    this.setPage(1);
  }

  getServices() {
    this.providerServicesService.services.subscribe(
      (resp) => {
        this.services = resp;
        const temp = [];
        for (let i = 0; i < this.feedbacksList.length; i++) {
          for (let j = 0; j < this.services.length; j++) {
            const obj = this.feedbacksList[i];
            const service = this.services[j];
            if (obj.service_id === service.id) {
              obj.service_name = service.name;
              if (temp.indexOf(service.id) < 0) {
                temp.push(service.id);
                this.filteredServices.push({
                  id: service.id,
                  name: service.name
                });
              }
            }
          }
        }
      }
    );
  }

  selectingFeedbacks(event): void {
    this.allItems = this.feedbacksList.filter(function(feedback) {
      return feedback.service_id === +event.value;
    });
    this.setPage(1);
  }

  reportFeedback(event) {
    const dialogRef = this.dialog.open(CreateReportProblemComponent);
    dialogRef.componentInstance.content = event;
    dialogRef.componentInstance.userId = this.userId;
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  setPage(page: number): void {
    if (page < 1) {
      return;
    }

    // get pager object from service
    this.pager = this.pagerService.getPager(this.allItems.length, page);

    // get current page of items
    this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

}
