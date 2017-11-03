import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidatorFn
} from '@angular/forms';

import { AuthService } from '../../../../shared/services/auth/auth.service';
import { ProfileService } from '../../../../shared/services/profile/profile.service';
import { Provider } from '../../../../shared/models/provider.model';
import { FormUtilsService } from '../../../../shared/forms/form-utils.service';
import { customEmailValidator } from '../../../../shared/components/validation/email-validator.directive';
import { DialogService } from '../../../../shared/services/dialog/dialog.service';

@Component({
  selector: 'app-provider-notification',
  templateUrl: './provider-notification.component.html',
  styleUrls: ['./provider-notification.component.scss']
})
export class ProviderNotificationComponent implements OnInit {
  public provider: Provider;
  private emailRegExp: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  isButtonDisabled = false;
  userId: number;
  notificationData: any = {};
  generalInfoForm: FormGroup;
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
    private profileService: ProfileService,
    private authService: AuthService,
    private fb: FormBuilder,
    formUtils: FormUtilsService,
    private dialogService: DialogService) {
    this.provider = formUtils.provider;
  }

  ngOnInit() {
    this.buildForm();
    this.profileService.getUserRoleData(this.authService.getUser().user.id, 'provider').subscribe(
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
        const responseObj = Object.keys(resp);
        if (responseObj.length === 0) {
          this.notificationData.user_id = this.userId;
        }
      },
      (error) => console.log('error - getFeedback', error)
    );
  }

  buildForm(): void {
    this.generalInfoForm = this.fb.group({
      'userEmail':  [this.notificationData.email_for_notifications, [
        Validators.required,
        customEmailValidator(this.emailRegExp)
      ]],
      'isEmail': false,
      'isFeedback': this.notificationData.is_feedbacks_notify,
      'isNews': this.notificationData.is_news_notify
    });

    this.userEmail = this.generalInfoForm.controls['userEmail'];

    this.generalInfoForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  }

  onValueChanged(data?: any) {
    if (!this.generalInfoForm) { return; }
    const form = this.generalInfoForm;

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
    this.isButtonDisabled = true;
    this.profileService.setNotificationsSetting(this.userId, this.notificationData).subscribe(
      (resp) => {
        this.dialogService.infoDialog('Die Änderungen wurden erfolgreich gespeichert');
        this.isButtonDisabled = false;
        }
    );
  }

}
