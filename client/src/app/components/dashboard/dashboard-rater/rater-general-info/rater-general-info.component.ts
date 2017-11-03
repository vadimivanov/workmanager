import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ReactiveFormsModule,
  NgForm
} from '@angular/forms';
import { MdDialog } from '@angular/material';

import { FormUtilsService } from '../../../../shared/forms/form-utils.service';
import { Rater } from '../../../../shared/models/rater.model';
import { ProfileService } from '../../../../shared/services/profile/profile.service';
import { AuthService } from '../../../../shared/services/auth/auth.service';
import { InfoDialogComponent } from '../../../../shared/components/modals/info-dialog/info-dialog.component';
import { User } from '../../../../shared/models/user.model';
import { customEmailValidator } from '../../../../shared/components/validation/email-validator.directive';

@Component({
  selector: 'app-rater-general-info',
  templateUrl: './rater-general-info.component.html',
  styleUrls: ['./rater-general-info.component.scss']
})
export class RaterGeneralInfoComponent implements OnInit {
  public rater: Rater;
  public user: User;
  private show = false;
  private emailRegExp: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  protected avatar: File;
  raterForm: FormGroup;
  firstName: AbstractControl;
  lastName: AbstractControl;
  userLogin: AbstractControl;
  userPassword: AbstractControl;
  userEmail: AbstractControl;
  userOccupation: AbstractControl;
  userOrt: AbstractControl;
  userAbout: AbstractControl;
  isLoad = false;

  formErrors = {
    'firstName': '',
    'lastName': '',
    'userLogin': '',
    'userPassword': '',
    'userEmail': ''
  };

  validationMessages = {
    'firstName': {
      'required': 'Das Feld ist erforderlich.'
    },
    'lastName': {
      'required': 'Das Feld ist erforderlich.'
    },
    'userLogin': {
      'required': 'Das Login ist erforderlich.'
    },
    'userPassword': {
      'required': 'Das Passwort ist erforderlich.',
      'minlength': 'Das Passwort muss mindestens 8 Zeichen lang sein und aus Grossbuchstaben, Kleinbuchstaben und Zahlen bestehen.'
    },
    'userEmail': {
      'required': 'Die E-Mail ist erforderlich.',
      'validateEmail': 'Die E-Mail muss gültig sein.'
    }
  };

  @ViewChild('userPassEl')
  userPassEl: any;

  constructor(
    public dialog: MdDialog,
    private profileService: ProfileService,
    formUtils: FormUtilsService,
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder) {
    this.user = new User('', '', '');
    this.rater = formUtils.rater;
  }

  ngOnInit() {
    this.buildForm();
  }

  buildForm(): void {
    this.raterForm = this.fb.group({
      'firstName':  [this.rater.first_name, Validators.required],
      'lastName':  [this.rater.last_name, Validators.required],
      'userOccupation':  '',
      'userOrt':  '',
      'userAbout':  '',
      'userEmail':  [this.user.email, [
        Validators.required,
        customEmailValidator(this.emailRegExp)
      ]
      ]
    });

    this.firstName = this.raterForm.controls['firstName'];
    this.lastName = this.raterForm.controls['lastName'];
    this.userEmail = this.raterForm.controls['userEmail'];
    this.userOccupation = this.raterForm.controls['userOccupation'];
    this.userOrt = this.raterForm.controls['userOrt'];
    this.userAbout = this.raterForm.controls['userAbout'];

    this.raterForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
  }

  onValueChanged(data?: any) {
    if (!this.raterForm) { return; }
    const form = this.raterForm;

    for (const field in this.formErrors) {
      // clear previous error message (if any)
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

  onSelectAvatar(avatar: File): void {
    if (avatar) {
      const file = avatar;
      const formData = new FormData();
      formData.append('file', file);
      this.upload(formData);
    }
    this.avatar = avatar;
  }

  upload(file) {
    this.profileService.uploadImages(file).subscribe(
      (resp) => {
        this.rater.photo_url = resp.Location;
      }
    );
  }

  onSubmit(event) {
    if (!this.isLoad && this.raterForm.valid) {
      this.isLoad = true;
      this.rater.first_name = event.firstName;
      this.rater.last_name = event.lastName;
      this.rater.email = event.userEmail;
      this.rater.occupation = event.userOccupation;
      this.rater.city = event.userOrt;
      this.rater.about = event.userAbout;
      this.profileService.editUser(this.rater.id, 'rater', this.rater).subscribe(
        (resp) => {
          this.profileService.subject.next({ text: 'user update' });
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
