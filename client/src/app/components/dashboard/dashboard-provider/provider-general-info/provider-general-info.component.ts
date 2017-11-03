import { Component, Inject, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidatorFn
} from '@angular/forms';

import { ProfileService } from '../../../../shared/services/profile/profile.service';
import { Provider } from '../../../../shared/models/provider.model';
import { FormUtilsService } from '../../../../shared/forms/form-utils.service';
import { AuthService } from '../../../../shared/services/auth/auth.service';
import { DialogService } from '../../../../shared/services/dialog/dialog.service';
import { customEmailValidator } from '../../../../shared/components/validation/email-validator.directive';
import { Rater } from '../../../../shared/models/rater.model';

export function telValidation(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => {
    const input = control.value,
      isValid = /^\+41[0-9]{10}$/.test(input);
    if (isValid) {
      return null;
    } else {
      return {'telValidation': {input}}
    }
  };
}

@Component({
  selector: 'app-provider-general-info',
  templateUrl: './provider-general-info.component.html',
  styleUrls: ['./provider-general-info.component.scss']
})
export class ProviderGeneralInfoComponent implements OnInit {
  public provider: Provider;
  private emailRegExp: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  protected avatar: File;

  @Input()
  public readonly = false;
  @ViewChild('fileInput') fileInput: ElementRef;

  genders = [
    {id: 0, title: 'Herr', name: 'Male'},
    {id: 1, title: 'Frau', name: 'Female'}
  ];

  generalInfoForm: FormGroup;
  gender: AbstractControl;
  firstName: AbstractControl;
  lastName: AbstractControl;
  telNo: AbstractControl;
  email: AbstractControl;
  currentUserData: Rater;
  userId: number;
  userRole: string;
  userLink: string;

  formErrors = {
    'gender': '',
    'firstName': '',
    'lastName': '',
    'telNo': '',
    'email': '',
    'password': ''
  };

  validationMessages = {
    'gender': {
      'required': 'Das Geschlecht ist erforderlich.'
    },
    'firstName': {
      'required': 'Der Vorname ist erforderlich.'
    },
    'lastName': {
      'required': 'Der Nachname ist erforderlich.'
    },
    'telNo': {
      'required': 'Die Telefonnummer ist erforderlich.',
      'telValidation': 'Die Telefonnummer soll mit +41 beginnen und 10 Nummern lang sein.'
    },
    'email': {
      'required': 'Die E-Mail ist erforderlich.',
      'validateEmail': 'Die E-Mail muss gültig sein.'
    }
  };

  constructor(
    private fb: FormBuilder,
    formUtils: FormUtilsService,
    private router: Router,
    private rroute: ActivatedRoute,
    private profileService: ProfileService,
    private authService: AuthService,
    private dialogService: DialogService) {
    this.provider = formUtils.provider;
  }

  ngOnInit() {
    this.buildForm();
    const dd = 'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6M30.bD08IKQv7UkcxSLWM0rt_eunRCYn5AdJMxG9tbu4oBc';
    const res = dd.substring(dd.indexOf('JWT') + 3, dd.length);

    this.userId = JSON.parse(localStorage.getItem('currentUser')).user.id;
    this.profileService.getUser(this.userId).subscribe(
      (resp) => {
        this.currentUserData = JSON.parse(resp._body);
        this.userRole = this.currentUserData.role;
        this.getUser();
      }
    );
  }

  getUser(): void {
    this.profileService.getUserRoleData(this.userId, this.userRole).subscribe(
      (resp) => {
        const userData = JSON.parse(resp._body);
        this.provider.firstName = userData.contact_person_info.first_name;
        this.provider.lastName = userData.contact_person_info.last_name;
        this.provider.email = userData.contact_person_info.contactEmail;
        this.provider.telNo = userData.contact_person_info.workPhone;
        this.provider.gender = userData.contact_person_info.gender;
        if (userData.photo_url !== null) {
          this.provider.photoUrl = userData.photo_url;
        }
        this.userLink = document.location.protocol + '//' + document.location.hostname + ':' + document.location.port + '/#/provider-profile/' + this.userId;
      }
    )
  }

  buildForm(): void {
    this.generalInfoForm = this.fb.group({
      'gender':  [this.provider.gender, Validators.required],
      'firstName':  [this.provider.firstName, Validators.required],
      'lastName':  [this.provider.lastName, Validators.required],
      'telNo':  [this.provider.telNo, [
          Validators.required,
          telValidation()
        ]
      ],
      'email':  [this.provider.email, [
          Validators.required,
          customEmailValidator(this.emailRegExp)
        ]
      ]
    });

    this.gender = this.generalInfoForm.controls['gender'];
    this.firstName = this.generalInfoForm.controls['firstName'];
    this.lastName = this.generalInfoForm.controls['lastName'];
    this.telNo = this.generalInfoForm.controls['telNo'];
    this.email = this.generalInfoForm.controls['email'];

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
        this.provider.photoUrl = resp.Location;
      },
      (error) => console.log('error - upload', error)
    );
  }

  save() {
    this.provider.gender = this.generalInfoForm.value.gender;
    this.provider.firstName = this.generalInfoForm.value.firstName;
    this.provider.lastName = this.generalInfoForm.value.lastName;
    this.provider.telNo = this.generalInfoForm.value.telNo;
    this.provider.email = this.generalInfoForm.value.email;
    let data = {
      contact_person_info: {
        first_name: this.provider.firstName,
        last_name: this.provider.lastName,
        gender: this.provider.gender,
        workPhone: this.provider.telNo,
        contactEmail: this.provider.email
      },
      photo_url: this.provider.photoUrl
    };
    this.profileService.editUser(this.authService.getUser().user.id, 'provider', data).subscribe(
      (resp) => {
        this.profileService.subject.next({ text: 'user update' });
        this.dialogService.infoDialog('Die Änderungen wurden erfolgreich gespeichert');
      }
    );
  }
}
