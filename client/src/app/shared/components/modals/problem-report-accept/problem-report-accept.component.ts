import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';

import { NotificationsService } from '../../../../shared/services/notifications/notifications.service';

@Component({
  selector: 'app-problem-report-accept',
  templateUrl: './problem-report-accept.component.html',
  styleUrls: ['./problem-report-accept.component.scss']
})
export class ProblemReportAcceptComponent implements OnInit {

  content: any;
  userId: number;
  problemId: number;
  parentPopup: any;
  message: string;
  isEmptyMsg = false;

  constructor(
    public dialogRef: MdDialogRef<ProblemReportAcceptComponent>,
    private notificationsService: NotificationsService) { }

  ngOnInit() {
    this.userId = this.content.user_id;
    this.problemId = this.content.id;
    this.parentPopup = this.content.parentPopup;
  }

  confirm() {
    if (!this.message) {
      this.isEmptyMsg = true;
      return false;
    }
    this.notificationsService.updateProblemReport({userId: this.userId, problemId: this.problemId, reason_reject: this.message, is_approved: false, is_viewed: true}).subscribe(
      (resp) => {
        this.parentPopup.close({ msg: 'confirm' });
        this.dialogRef.close({ msg: 'confirm' });
      }
    );
  }
}
