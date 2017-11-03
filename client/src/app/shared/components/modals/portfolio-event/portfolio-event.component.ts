import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';

import { ProviderServicesService } from '../../../../shared/services/provider-services/provider-services.service';
import { NotificationsService } from '../../../../shared/services/notifications/notifications.service';

@Component({
  selector: 'app-portfolio-event',
  templateUrl: './portfolio-event.component.html',
  styleUrls: ['./portfolio-event.component.scss']
})
export class PortfolioEventComponent implements OnInit {

  content: any;
  serviceName: '';
  providerName: '';
  providerPhoto: '';
  providerUserId: null;

  constructor(
    public dialogRef: MdDialogRef<PortfolioEventComponent>,
    private providerServicesService: ProviderServicesService,
    private notificationsService: NotificationsService
  ) { }

  ngOnInit() {
    if (this.content.Provider) {
      this.providerName = this.content.Provider.company_name;
      this.providerPhoto = this.content.Provider.photo_url;
      this.providerUserId = this.content.Provider.user_id
    }

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
    this.notificationsService.updatePortfolioPhotos({userId: this.providerUserId, photoId: this.content.id, is_approved: true, is_viewed: true}).subscribe(
      (resp) => {
        this.dialogRef.close({ msg: 'confirm' });
      }
    );
  }

  cancel() {
    this.notificationsService.deletePortfolioPhotos({userId: this.providerUserId, photoId: this.content.id, is_approved: false, is_viewed: true}).subscribe(
      (resp) => {
        this.dialogRef.close({ msg: 'cancel' });
      }
    );
  }
}
