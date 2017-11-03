import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';

import { ProviderServicesService } from '../../../../shared/services/provider-services/provider-services.service';
import { NotificationsService } from '../../../../shared/services/notifications/notifications.service';
import { FeedbackDeclineComponent } from '../../../../shared/components/modals/feedback-decline/feedback-decline.component';

@Component({
  selector: 'app-feedback-event',
  templateUrl: './feedback-event.component.html',
  styleUrls: ['./feedback-event.component.scss']
})
export class FeedbackEventComponent implements OnInit {

  content: any;
  serviceName: '';
  raterName: string;
  providerName: string;
  raterPhoto: '';
  raterUserId: null;
  rating: number;

  constructor(
    public dialog: MdDialog,
    public dialogRef: MdDialogRef<FeedbackEventComponent>,
    private providerServicesService: ProviderServicesService,
    private notificationsService: NotificationsService
  ) { }

  ngOnInit() {
    this.raterName = '';
    this.raterName += this.content.Rater.first_name ? this.content.Rater.first_name + ' ' : '';
    this.raterName += this.content.Rater.last_name ? this.content.Rater.last_name : '';
    this.raterPhoto = this.content.Rater.photo_url;
    this.raterUserId = this.content.Rater.user_id;
    this.rating = ((this.content.quality_of_friendliness + this.content.quality_of_price + this.content.quality_of_timeschedule + this.content.quality_of_work) / 4);
    this.providerServicesService.getCurrentProvider(this.content.provider_id).subscribe(
      (resp) => {
        this.providerName = resp.Provider.company_name;
      }
    );
    this.providerServicesService.services.subscribe(
      (resp) => {
        for (let i = 0; i < resp.length; i++) {
          if (resp[i].id === this.content.service_id) {
            this.serviceName = resp[i].name;
          }

        }
      }
    )
  }

  confirm() {
    this.notificationsService.updateFeedbackNotifications({
      userId: this.raterUserId,
      feedbackId: this.content.id,
      is_approved: true,
      is_viewed: true,
      is_displaying: true
    }).subscribe(
      (resp) => {
        this.dialogRef.close({ msg: 'confirm' });
      }
    );
  }

  cancel() {
    const dialogRef = this.dialog.open(FeedbackDeclineComponent);
    this.content.parentPopup = this.dialogRef;
    dialogRef.componentInstance.content = this.content;
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.msg) {
        this.dialogRef.close({msg: 'cancel'});
      }
    });
  }

}
