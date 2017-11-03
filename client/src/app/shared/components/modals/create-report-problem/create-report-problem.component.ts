import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';

import { ProfileService } from '../../../../shared/services/profile/profile.service';
import { NotificationsService } from '../../../../shared/services/notifications/notifications.service';

@Component({
  selector: 'app-create-report-problem',
  templateUrl: './create-report-problem.component.html',
  styleUrls: ['./create-report-problem.component.scss']
})
export class CreateReportProblemComponent implements OnInit {

  content: any;
  userId: number;
  problemId: number;
  parentPopup: any;
  message: string;
  initiatorData: any;
  isEmptyMsg = false;

  constructor(
    private profileService: ProfileService,
    public dialogRef: MdDialogRef<CreateReportProblemComponent>) { }

  ngOnInit() {
    this.problemId = this.content.id;
    this.initiatorData = JSON.parse(localStorage.getItem('currentUser'));
    this.userId = this.initiatorData.user.id;
  }

  confirm() {
    if (!this.message) {
      this.isEmptyMsg = true;
      return false;
    }
    if (this.initiatorData) {
      const report = {
        reason: 'TODO',
        description: this.message,
        is_approved: false,
        feedback_id: this.content.feedId,
        user_id: this.userId
      };
      this.profileService.reportFeedback(this.userId, this.content.feedId, report).subscribe(
        (resp) => {}
      );
      this.dialogRef.close({ msg: 'confirm' });
    }
  }

}
