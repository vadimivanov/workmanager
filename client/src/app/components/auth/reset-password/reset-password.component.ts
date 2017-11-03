import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidatorFn
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ProfileService } from '../../../shared/services/profile/profile.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  resetForm: FormGroup;
  userConfirmPassword: AbstractControl;
  userPassword: AbstractControl;
  private show = false;
  private showConf = false;
  password: string;
  confirmPassword: string;
  id: number;
  jwt: string;

  formErrors = {
    'userConfirmPassword': '',
    'userPassword': ''
  };

  validationMessages = {
    'userConfirmPassword': {
      'required': 'Die Passwortbestätigung ist erforderlich.',
      'passMatching': 'Beide Passwörter müssen gleich sein.'
    },
    'userPassword': {
      'required': 'Das Passwort ist erforderlich.',
      'minlength': 'Das Passwort muss mindestens 8 Zeichen lang sein und aus Grossbuchstaben, Kleinbuchstaben und Zahlen bestehen'
    }
  };

  @ViewChild('passEl')
  passEl: any;
  @ViewChild('confPassEl')
  confPassEl: any;

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private profileServide: ProfileService,
              private router: Router) {
    route.queryParams.subscribe(params => {
      this.id = params['id'];
      this.jwt = params['jwt'];
    });
  }

  ngOnInit() {
    this.buildForm();
  }

  buildForm(): void {
    this.resetForm = this.fb.group({
      'userConfirmPassword':  [this.confirmPassword, [
          Validators.required,
          this.passMatching()
        ]
      ],
      'userPassword':  [this.password, [
          Validators.required,
          Validators.minLength(8)
        ]
      ]
    });

    this.userConfirmPassword = this.resetForm.controls['userConfirmPassword'];
    this.userPassword = this.resetForm.controls['userPassword'];

    this.resetForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  }

  passMatching(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {
      const input = control.value,
        isValid = input === this.password;
      if (isValid) {
        return null;
      } else {
        return {'passMatching': {input}}
      }
    };
  }

  onValueChanged(data?: any) {
    if (!this.resetForm) { return; }
    const form = this.resetForm;

    for (const field in this.formErrors) {

      if (this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = '';
        const control = form.get(field);

        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onSubmit(value: string): void {
    this.resetPassword();
  }

  resetPassword() {
    this.profileServide.resetPassword(this.id, this.jwt, this.password).subscribe(
      (resp) => {
        this.router.navigate(['/login']);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  changePasswordType() {
    this.passEl.nativeElement.type = this.show ? 'password' : 'text';
    this.show = !this.show;
  }

  changeConfPasswordType() {
    this.confPassEl.nativeElement.type = this.showConf ? 'password' : 'text';
    this.showConf = !this.showConf;
  }

}
