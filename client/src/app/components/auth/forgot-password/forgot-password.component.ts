import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { MdDialog } from '@angular/material';

import { ProfileService } from '../../../shared/services/profile/profile.service';
import { InfoDialogComponent } from '../../../shared/components/modals/info-dialog/info-dialog.component';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  isVisiblePopup: boolean = false;
  email: string = '';
  userId: number;
  forgotPassForm: FormGroup;
  emailError: boolean = false;

  constructor(
    public dialog: MdDialog,
    private fb: FormBuilder,
    private profileService: ProfileService) { }

  ngOnInit() {
    let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.forgotPassForm = this.fb.group({
      email: ['', [<any>Validators.required, <any>Validators.pattern(emailRegex) ]],
    });
  }

  checkUser() {
    if (!this.forgotPassForm.valid) {
      return;
    }
    this.emailError = false;
    this.profileService.getUserByEmail(this.email).subscribe(
      (resp) => {
        if (resp.status === 204) {
          this.openDialog('Leider konnten wir Sie anhand der eingegebenen Daten nicht eindeutig identifizieren.');
        }
        if (resp.status === 200) {
          this.userId = resp.json()[0].id;
          this.sendEmail();
        } else {
          this.emailError = true;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  sendEmail() {
    this.profileService.forgotPassword(this.userId).subscribe(
      (resp) => {
        console.log(resp);
        this.showPopup();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  showPopup() {
    this.isVisiblePopup = true;
  }

  closePopup() {
    this.isVisiblePopup = false;
  }

  openDialog(msg) {
    const dialogRef = this.dialog.open(InfoDialogComponent);
    dialogRef.componentInstance.infoText = msg;
  }

}
