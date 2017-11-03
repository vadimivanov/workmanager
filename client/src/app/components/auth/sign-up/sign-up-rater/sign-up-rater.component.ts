import { Component, ViewChild, OnInit, Compiler } from '@angular/core';
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

import { AuthService } from '../../../../shared/services/auth/auth.service';
import { User } from '../../../../shared/models/user.model';
import { customEmailValidator } from '../../../../shared/components/validation/email-validator.directive';
import { InfoDialogComponent } from '../../../../shared/components/modals/info-dialog/info-dialog.component';

@Component({
  selector: 'app-sign-up-rater',
  templateUrl: './sign-up-rater.component.html',
  styleUrls: ['./sign-up-rater.component.scss']
})
export class SignUpRaterComponent implements OnInit {
  public raterId: number;
  public user: User;
  private show = false;
  private emailRegExp: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  isButtonDisabled = false;
  signupForm: FormGroup;
  userFirstName: AbstractControl;
  userLastName: AbstractControl;
  userPassword: AbstractControl;
  userEmail: AbstractControl;

  formErrors = {
    'userFirstName': '',
    'userLastName': '',
    'userPassword': '',
    'userEmail': ''
  };

  validationMessages = {
    'userFirstName': {
      'required': 'Benutzer-Vorname ist ein Pflichtfeld.'
    },
    'userLastName': {
      'required': 'Benutzer-Nachname ist ein Pflichtfeld.'
    },
    'userPassword': {
      'required': 'Passwort ist ein Pflichtfeld.',
      'minlength': 'Das Passwort muss mindestens 8 Zeichen lang sein und aus Grossbuchstaben, Kleinbuchstaben und Zahlen bestehen'
    },
    'userEmail': {
      'required': 'E-Mail ist ein Pflichtfeld.',
      'validateEmail': 'Bitte geben Sie eine gültige E-Mail Adresse an.'
    }
  };

  @ViewChild('userPassEl')
  userPassEl: any;

  constructor(
    public dialog: MdDialog,
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder,
    private _compiler: Compiler) {
    this.user = new User('', '', '');
  }

  ngOnInit() {
    this.buildForm();
  }

  buildForm(): void {
    this.signupForm = this.fb.group({
      'userFirstName':  [this.user.firstName, Validators.required],
      'userLastName':  [this.user.lastName, Validators.required],
      'userPassword':  [this.user.password, [
          Validators.required,
          Validators.minLength(8)
        ]
      ],
      'userEmail':  [this.user.email, [
          Validators.required,
          customEmailValidator(this.emailRegExp)
        ]
      ]
    });

    this.userFirstName = this.signupForm.controls['userFirstName'];
    this.userLastName = this.signupForm.controls['userLastName'];
    this.userPassword = this.signupForm.controls['userPassword'];
    this.userEmail = this.signupForm.controls['userEmail'];

    this.signupForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
  }

  onValueChanged(data?: any) {
    if (!this.signupForm) { return; }
    const form = this.signupForm;

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

  onSubmit(value: string): void {
    this.isButtonDisabled = true;
    this.register();
  }

  register() {
    this.user.login = this.user.firstName + ' ' + this.user.lastName;
    this.authService.register(this.user, 'rater').subscribe(
      (rater) => {
        this.raterId = rater.id;
        this.signup(rater.JWT);
      },
      (error) => {
        this.isButtonDisabled = false;
        this.user.email = '';
        console.log('Unfortunately we were unable to create your account.', error);
      }
    );
  }

  signup(token) {
    const raterData = {
      first_name: this.user.firstName,
      last_name: this.user.lastName
    };
    this.authService.signup(raterData, this.raterId, token, 'rater').subscribe(
      (resp) => {
        this.authService.confirmation(resp.user_id).subscribe(
          (response) => {
            this.openDialog();
            this._compiler.clearCache();
            this.router.navigate(['/home']);
          },
          (error) => {
            if (error.status === 400) {
              this.errorSendEmailDialog();
            }
            console.log('Unfortunately we were unable to confirmation email.', error);
          }
        );
      }
    );
    this.isButtonDisabled = true;
  }

  login() {
    this.authService.login(this.user).subscribe(
      (resp) => {
        localStorage.setItem('currentUser', JSON.stringify(resp));
        this.router.navigate(['/home']);
      },
      (error) => {
        console.log('error loggin on.', error);
      }
    );
  }

  changePasswordType() {
    this.userPassEl.nativeElement.type = this.show ? 'password' : 'text';
    this.show = !this.show;
  }

  openDialog() {
    const dialogRef = this.dialog.open(InfoDialogComponent);
    dialogRef.componentInstance.infoText = 'Bitte bestätigen Sie Ihre Anmeldung per E-Mail';
  }

  errorSendEmailDialog() {
    const dialogRef = this.dialog.open(InfoDialogComponent);
    dialogRef.componentInstance.infoText = 'Wir konnten Ihre E-Mail Adresse nicht erreichen. Bitte versuchen Sie es später noch einmal';
  }
}
