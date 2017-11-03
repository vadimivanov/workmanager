import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidatorFn
} from '@angular/forms';
import { MdDialog } from '@angular/material';

import { AuthService } from '../../../../shared/services/auth/auth.service';
import { ProfileService } from '../../../../shared/services/profile/profile.service';
import { FormUtilsService } from '../../../../shared/forms/form-utils.service';
import { Rater } from '../../../../shared/models/rater.model';
import { customEmailValidator } from '../../../../shared/components/validation/email-validator.directive';
import { InfoDialogComponent } from '../../../../shared/components/modals/info-dialog/info-dialog.component';

@Component({
  selector: 'app-rater-notifications',
  templateUrl: './rater-notifications.component.html',
  styleUrls: ['./rater-notifications.component.scss']
})
export class RaterNotificationsComponent implements OnInit {

  userId: number;
  notificationData: any = {};
  resetForm: FormGroup;
  isLoad = false;
  public rater: Rater;
  private emailRegExp: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  userEmail: AbstractControl;

  formErrors = {
    'userEmail': ''
  };

  validationMessages = {
    'userEmail': {
      'required': 'Die E-Mail ist erforderlich.',
      'validateEmail': 'Die E-Mail muss gültig sein.'
    }
  };

  constructor(
    public dialog: MdDialog,
    private profileService: ProfileService,
    private authService: AuthService,
    formUtils: FormUtilsService,
    private fb: FormBuilder) {
    this.rater = formUtils.rater;
  }

  ngOnInit() {
    this.buildForm();
    this.profileService.getUserRoleData(this.authService.getUser().user.id, 'rater').subscribe(
      (item) => {
        this.userId = this.authService.getUser().user.id;
        this.getNotifications();
      }
    );
  }

  getNotifications(): void {
    this.profileService.getNotifications(this.userId).subscribe(
      (resp) => {
        this.notificationData = resp;
      }
    );
  }

  buildForm(): void {
    this.resetForm = this.fb.group({
      'userEmail':  [this.notificationData.email_for_notifications, [
        Validators.required,
        customEmailValidator(this.emailRegExp)
      ]],
      // 'isEmail': false,
      'isFeedback': this.notificationData.is_feedbacks_request_notify,
      'isNews': this.notificationData.is_news_notify
    });

    this.userEmail = this.resetForm.controls['userEmail'];

    this.resetForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  }

  onValueChanged(data?: any) {
    if (!this.resetForm) { return; }
    const form = this.resetForm;

    for (const field in this.formErrors) {
      this.formErrors[field] = '';
      const control = form.get(field);

      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  onSubmit(value: any): void {
    if (!this.isLoad) {
      this.isLoad = true;
      this.profileService.setNotificationsSetting(this.userId, this.notificationData).subscribe(
        (resp) => {
          this.openDialog();
        }
      );
    }
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
