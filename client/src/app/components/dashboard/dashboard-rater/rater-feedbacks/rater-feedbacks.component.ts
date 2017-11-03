import { Component, OnInit } from '@angular/core';
import {MdDialog, MdDialogRef} from '@angular/material';

import { ProfileService } from '../../../../shared/services/profile/profile.service';
import { ProviderServicesService } from '../../../../shared/services/provider-services/provider-services.service';
import { FormUtilsService } from '../../../../shared/forms/form-utils.service';
import { Rater } from '../../../../shared/models/rater.model';
import { PagerService } from '../../../../shared/services/pager/pager.service';
import { RATING } from '../../../../shared/constants';
import { STATUSES } from '../../../../shared/constants';
import { ConfirmDialogComponent } from '../../../../shared/components/modals/confirm-dialog/confirm-dialog.component';
import { InfoDialogComponent } from '../../../../shared/components/modals/info-dialog/info-dialog.component';

@Component({
  selector: 'app-rater-feedbacks',
  templateUrl: './rater-feedbacks.component.html',
  styleUrls: ['./rater-feedbacks.component.scss']
})
export class RaterFeedbacksComponent implements OnInit {

  public rater: Rater;
  feedbacksList: any[];
  feedbacksStatuses = STATUSES;
  services: any[];
  isRater = false;
  isLoad = false;
  // array of all items to be paged
  private allItems: any[];

  // pager object
  pager: any = {};

  // paged items
  pagedItems: any[];
  constructor(
    public dialog: MdDialog,
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
    this.profileService.getFeedback(this.rater.id, 'rater').subscribe(
      (response) => {
        if (response._body) {
          this.feedbacksList = JSON.parse(response._body);
          this.fillFeedbacksList();
        }
      }
    );
  }

  fillFeedbacksList() {
    for (let i = 0; i < this.feedbacksList.length; i++) {
      const obj = this.feedbacksList[i];

      if (obj.Provider != null) {
        const provider = obj.Provider;

        obj.rating = ((obj.quality_of_friendliness + obj.quality_of_price + obj.quality_of_timeschedule + obj.quality_of_work) / 4);
        obj.provider_photo_url = provider.photo_url;
        obj.provider_company_name = provider.company_name;
        obj.provider_id = provider.user_id;
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
      if (event.value === '') {
        this.allItems = this.feedbacksList.filter(function(feedback) {
          return feedback;
        });
      }
      if (event.value === 'is_approved') {
        this.allItems = this.feedbacksList.filter(function(feedback) {
          return feedback.is_approved === true && feedback.is_displaying === true;
        });
      }
      if (event.value === 'check') {
        this.allItems = this.feedbacksList.filter(function(feedback) {
          return feedback.is_approved === null;
        });
      }
      if (event.value === 'block') {
        this.allItems = this.feedbacksList.filter(function(feedback) {
          return feedback.is_approved === true && !feedback.is_displaying;
        });
      }
      if (event.value === 'report') {
        this.allItems = this.feedbacksList.filter(function(feedback) {
          return feedback.is_approved === false;
        });
      }
    }
    this.setPage(1);
  }

  editFeed(event) {
    if (!this.isLoad) {
      this.isLoad = true;
      if (event.feedRemove) {
        this.confirmDialog(event);
      } else {
        this.profileService.editFeedback(this.rater.id, 'rater', event.feedId, event.val).subscribe(
          (response) => {
            this.openDialog();
            this.getFeedbacks();
          }
        );
      }
    }
  }

  removeFeedback(event) {
    this.profileService.removeFeedback(this.rater.id, 'rater', event.feedId).subscribe(
      (response) => {
        this.getFeedbacks();
      }
    );
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

  confirmDialog(event): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.componentInstance.infoText = 'Sind Sie sicher?';
    dialogRef.afterClosed().subscribe(result => {
      this.isLoad = false;
      if (result && result.msg) {
        this.removeFeedback(event);
      }
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(InfoDialogComponent);
    dialogRef.componentInstance.infoText = 'Die Änderungen wurden erfolgreich gespeichert';
    this.isLoad = false;
    dialogRef.afterClosed().subscribe(result => {
      this.isLoad = false;
    });
  }

}
