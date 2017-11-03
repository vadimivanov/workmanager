import { Component, OnInit } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MdDialogRef } from '@angular/material';

import { Provider } from '../../../models/provider.model';
import { AuthService } from '../../../services/auth/auth.service';
import { customEmailValidator } from '../../validation/email-validator.directive';

export function telValidation(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => {
    const input = control.value,
      isValid = /^\+41[0-9]{8}$/.test(input);
    if (isValid) {
      return null;
    } else {
      return {'telValidation': {input}}
    }
  };
}

@Component({
  selector: 'app-fill-provider-data',
  templateUrl: './fill-provider-data.component.html',
  styleUrls: ['./fill-provider-data.component.scss']
})
export class FillProviderDataComponent implements OnInit {

  provider: Provider;
  private emailRegExp: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  user: any;
  genders = [
    {id: 0, title: 'Herr.', name: 'Male'},
    {id: 1, title: 'Frau.', name: 'Female'}
  ];

  fillInfoForm: FormGroup;
  gender: AbstractControl;
  firstName: AbstractControl;
  lastName: AbstractControl;
  telNo: AbstractControl;
  email: AbstractControl;

  formErrors = {
    'gender': '',
    'firstName': '',
    'lastName': '',
    'telNo': '',
    'email': ''
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
      'telValidation': 'Die Telefonnummer muss mit +41 beginnen und 10 Nummern lang sein.'
    },
    'email': {
      'required': 'Die E-Mail ist erforderlich.',
      'validateEmail': 'Die E-Mail muss gültig sein.'
    }
  };

  constructor(
    public dialogRef: MdDialogRef<FillProviderDataComponent>,
    private fb: FormBuilder,
    private router: Router,
    private r: ActivatedRoute,
    private authService: AuthService) {
  }

  ngOnInit() {
    this.provider = new Provider('', '', '');
    this.provider.telNo = '+41';
    this.buildForm();
  }

  buildForm(): void {
    this.fillInfoForm = this.fb.group({
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

    this.gender = this.fillInfoForm.controls['gender'];
    this.firstName = this.fillInfoForm.controls['firstName'];
    this.lastName = this.fillInfoForm.controls['lastName'];
    this.telNo = this.fillInfoForm.controls['telNo'];
    this.email = this.fillInfoForm.controls['email'];

    this.fillInfoForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  }

  onValueChanged(data?: any) {
    if (!this.fillInfoForm) { return; }
    const form = this.fillInfoForm;

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

  next() {
    this.provider.gender = this.fillInfoForm.value.gender;
    this.provider.firstName = this.fillInfoForm.value.firstName;
    this.provider.lastName = this.fillInfoForm.value.lastName;
    this.provider.telNo = this.fillInfoForm.value.telNo;
    this.provider.email = this.fillInfoForm.value.email;
    this.provider.login = this.fillInfoForm.value.email;

    this.user = this.authService.getUser();
    this.signUp(this.user.JWT, this.user.user.id);
  }

  signUp(token, userId) {
    const providerData = {
      gender: this.provider.gender,
      first_name_of_representative: this.provider.firstName,
      last_name_of_representative: this.provider.lastName,
      telephone_number: this.provider.telNo,
      email: this.provider.email
    };
    this.authService.signup(providerData, userId, token, 'provider').subscribe(
      (resp) => {
        this.dialogRef.close();
      },
      (error) => {
      }
    );
  }
}
