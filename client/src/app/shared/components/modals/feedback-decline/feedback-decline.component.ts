import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';

import { NotificationsService } from '../../../../shared/services/notifications/notifications.service';

@Component({
  selector: 'app-feedback-decline',
  templateUrl: './feedback-decline.component.html',
  styleUrls: ['./feedback-decline.component.scss']
})
export class FeedbackDeclineComponent implements OnInit {

  content: any;
  userId: number;
  problemId: number;
  parentPopup: any;
  message: string;
  isEmptyMsg = false;
  constructor(
    public dialogRef: MdDialogRef<FeedbackDeclineComponent>,
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
    this.notificationsService.updateFeedbackNotifications({userId: this.userId, feedbackId: this.content.id, reason_reject: this.message, is_approved: false, is_viewed: true}).subscribe(
      (resp) => {
        this.dialogRef.close({ msg: 'cancel' });
      }
    );
  }

}
