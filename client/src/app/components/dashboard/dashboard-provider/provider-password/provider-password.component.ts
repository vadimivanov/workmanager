import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidatorFn
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ProfileService } from '../../../../shared/services/profile/profile.service';
import { AuthService } from '../../../../shared/services/auth/auth.service';
import { User } from '../../../../shared/models/user.model';
import { DialogService } from '../../../../shared/services/dialog/dialog.service';

@Component({
  selector: 'app-provider-password',
  templateUrl: './provider-password.component.html',
  styleUrls: ['./provider-password.component.scss']
})
export class ProviderPasswordComponent implements OnInit {

  changePassForm: FormGroup;
  userConfirmPassword: AbstractControl;
  userPassword: AbstractControl;
  userOldPassword: AbstractControl;
  private show = false;
  private showConf = false;
  private showOld = false;
  password: string;
  confirmPassword: string;
  oldPassword: string;
  id: number;
  jwt: string;
  user: User;
  isFormValid: boolean;

  formErrors = {
    'userConfirmPassword': '',
    'userPassword': '',
    'userOldPassword': '',
  };

  validationMessages = {
    'userConfirmPassword': {
      'required': 'Die Passwortbestätigung ist erforderlich.',
      'passMatching': 'Beide Passwörter müssen gleich sein.'
    },
    'userPassword': {
      'required': 'Das Passwort ist erforderlich.',
      'minlength': 'Das Passwort muss mindestens 8 Zeichen lang sein und aus Grossbuchstaben, Kleinbuchstaben und Zahlen bestehen.'
    },
    'userOldPassword': {
      'required': 'Altes Passwort ist erforderlich.',
      'minlength': 'Das Passwort muss mindestens 8 Zeichen lang sein und aus Grossbuchstaben, Kleinbuchstaben und Zahlen bestehen.'
    }
  };

  @ViewChild('passEl')
  passEl: any;
  @ViewChild('confPassEl')
  confPassEl: any;
  @ViewChild('oldPassEl')
  oldPassEl: any;

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private profileServide: ProfileService,
              private router: Router,
              private authService: AuthService,
              private dialogService: DialogService) {
    this.id = this.authService.getUser().user.id;
    this.jwt = this.authService.getUser().JWT;
  }

  ngOnInit() {
    this.buildForm();
  }

  buildForm(): void {
    this.changePassForm = this.fb.group({
      'userConfirmPassword':  [this.confirmPassword, [
          Validators.required,
          this.passMatching()
        ]
      ],
      'userPassword':  [this.password, [
          Validators.required,
          Validators.minLength(8)
        ]
      ],
      'userOldPassword':  [this.oldPassword, [
          Validators.required,
          Validators.minLength(8)
        ]
      ]
    });

    this.userConfirmPassword = this.changePassForm.controls['userConfirmPassword'];
    this.userPassword = this.changePassForm.controls['userPassword'];
    this.userOldPassword = this.changePassForm.controls['userOldPassword'];

    this.changePassForm.valueChanges
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
    if (!this.changePassForm) { return; }
    const form = this.changePassForm;

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

  checkForm() {
    this.isFormValid = true;

    if (this.password !== this.confirmPassword) {
      this.formErrors.userConfirmPassword = this.validationMessages.userConfirmPassword.passMatching;
      this.isFormValid = false;
    }
  }

  onSubmit(value: string): void {
    this.checkForm();

    if (this.isFormValid) {
      this.checkOldPassword();
    }
  }

  checkOldPassword() {
    this.user = new User('', this.authService.getUser().user.email, this.oldPassword);
    this.authService.login(this.user).subscribe(
      (resp) => {
        this.changePassword();
      },
      (err) => {
        this.dialogService.infoDialog('Das alte Passwort stimmt nicht überein.Geben Sie das richtige alte Passwort ein');
      }
    );
  }

  changePassword() {
    this.profileServide.resetPassword(this.id, this.jwt, this.password).subscribe(
      (resp) => {
        this.dialogService.infoDialog('Die Änderungen wurden erfolgreich gespeichert');
      },
      (err) => {
      }
    );
  }

  forgotPassword() {
    this.router.navigate(['/forgot-password']);
  }

  changePasswordType() {
    this.passEl.nativeElement.type = this.show ? 'password' : 'text';
    this.show = !this.show;
  }

  changeConfPasswordType() {
    this.confPassEl.nativeElement.type = this.showConf ? 'password' : 'text';
    this.showConf = !this.showConf;
  }

  changeOldPasswordType() {
    this.oldPassEl.nativeElement.type = this.showOld ? 'password' : 'text';
    this.showOld = !this.showOld;
  }

}
