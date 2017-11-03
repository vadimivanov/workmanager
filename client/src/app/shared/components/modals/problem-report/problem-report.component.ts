import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';

import { ProviderServicesService } from '../../../../shared/services/provider-services/provider-services.service';
import { NotificationsService } from '../../../../shared/services/notifications/notifications.service';
import { ProblemReportAcceptComponent } from '../problem-report-accept/problem-report-accept.component';

@Component({
  selector: 'app-problem-report',
  templateUrl: './problem-report.component.html',
  styleUrls: ['./problem-report.component.scss']
})
export class ProblemReportComponent implements OnInit {

  content: any;
  userId: number;
  problemId: number;

  raterName: string;
  providerName: string;
  initiatiorName: string;
  serviceName: '';
  raterPhoto: '';
  raterUserId: null;
  rating: number;

  constructor(
    public dialog: MdDialog,
    public dialogRef: MdDialogRef<ProblemReportComponent>,
    private providerServicesService: ProviderServicesService,
    private notificationsService: NotificationsService
  ) { }

  ngOnInit() {
    if (this.content.Rater) {
      this.initiatiorName = this.content.Rater.first_name + ' ' + this.content.Rater.last_name;
    }
    if (this.content.Provider) {
      this.initiatiorName = this.content.Provider.company_name;
    }
    this.rating = ((this.content.Feedback.quality_of_friendliness + this.content.Feedback.quality_of_price + this.content.Feedback.quality_of_timeschedule + this.content.Feedback.quality_of_work) / 4);

    this.providerServicesService.getCurrentRater(this.content.Feedback.rater_id).subscribe(
      (resp) => {
        this.raterName = resp.first_name + ' ' + resp.last_name;
        this.raterPhoto = resp.photo_url;
        this.raterUserId = resp.user_id;
      }
    );
    this.providerServicesService.services.subscribe(
      (resp) => {
        for (let i = 0; i < resp.length; i++) {
          if (resp[i].id === this.content.Feedback.service_id) {
            this.serviceName = resp[i].name;
          }
        }
      }
    )
  }

  confirm() {
    this.notificationsService.updateProblemReport({userId: this.content.user_id, problemId: this.content.id, is_approved: true, is_viewed: true}).subscribe(
      (resp) => {
        this.dialogRef.close({ msg: 'confirm' });
      }
    );
  }

  cancel() {
    const dialogRef = this.dialog.open(ProblemReportAcceptComponent);
    this.content.parentPopup = this.dialogRef;
    dialogRef.componentInstance.content = this.content;
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.msg) {
        this.dialogRef.close({ msg: 'cancel' });
      }
    });
  }
}
