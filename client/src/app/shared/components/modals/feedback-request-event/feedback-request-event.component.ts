import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';

import { ProviderServicesService } from '../../../../shared/services/provider-services/provider-services.service';
import { NotificationsService } from '../../../../shared/services/notifications/notifications.service';

@Component({
  selector: 'app-feedback-request-event',
  templateUrl: './feedback-request-event.component.html',
  styleUrls: ['./feedback-request-event.component.scss']
})
export class FeedbackRequestEventComponent implements OnInit {

  content: any;
  serviceName: '';
  providerName: '';
  providerPhoto: '';
  providerUserId: null;

  constructor(
    public dialogRef: MdDialogRef<FeedbackRequestEventComponent>,
    private providerServicesService: ProviderServicesService,
    private notificationsService: NotificationsService
  ) { }

  ngOnInit() {
    this.providerServicesService.getCurrentProvider(this.content.provider_id).subscribe(
      (resp) => {
        this.providerName = resp.Provider.company_name;
        this.providerPhoto = resp.Provider.photo_url;
        this.providerUserId = resp.Provider.user_id;
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
    this.notificationsService.updateFeedbackNotifications({userId: this.providerUserId, feedbackId: this.content.id, is_approved: true}).subscribe(
      (resp) => {}
    );
    this.dialogRef.close({ msg: 'confirm' });
  }

  cancel() {
    this.notificationsService.updateFeedbackNotifications({userId: this.providerUserId, feedbackId: this.content.id, is_approved: false}).subscribe(
      (resp) => {}
    );
    this.dialogRef.close({ msg: 'cancel' });
  }


}
