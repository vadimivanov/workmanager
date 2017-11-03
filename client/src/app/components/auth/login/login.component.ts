import { Component, ViewChild, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ReactiveFormsModule,
  NgForm
} from '@angular/forms';
import { MdDialog } from '@angular/material';

import { AuthService } from '../../../shared/services/auth/auth.service';
import { User } from '../../../shared/models/user.model';
import { customEmailValidator } from '../../../shared/components/validation/email-validator.directive';
import { InfoDialogComponent } from '../../../shared/components/modals/info-dialog/info-dialog.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public user: User;
  private show = false;
  private returnUrl: string;
  private emailRegExp: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  loginForm: FormGroup;
  userEmail: AbstractControl;
  userPassword: AbstractControl;
  isRemember: AbstractControl;

  errorsMsgList = [
    'Bitte bestätigen Sie Ihre Anmeldung per E-Mail',
    'Ihr Konto wurde gesperrt oder deaktiviert. Bitte wenden Sie sich an den Support support@okornok.com',
    'Leider konnten wir Sie anhand der eingegebenen Daten nicht eindeutig identifizieren.'
  ];

  errorsMsgListKeys = [
    'Not verified email!',
    'Blocked user!',
    'Wrong credentials!'
  ];

  formErrors = {
    'userEmail': '',
    'userPassword': ''
  };

  validationMessages = {
    'userEmail': {
      'required': 'Die E-Mail ist erforderlich.',
      'validateEmail': 'Die E-Mail muss gültig sein.'
    },
    'userPassword': {
      'required': 'Das Passwort ist erforderlich.',
      'minlength': 'Das Passwort muss mindestens 8 Zeichen lang sein und aus Grossbuchstaben, Kleinbuchstaben und Zahlen bestehen'
    }
  };

  @ViewChild('userPassEl')
  userPassEl: any;

  constructor(
    public dialog: MdDialog,
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder,
    private route: ActivatedRoute) {
    this.user = new User('', '', '');
  }

  ngOnInit() {
    this.buildForm();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  buildForm(): void {
    this.loginForm = this.fb.group({
      'userEmail':  [this.user.email, [
        Validators.required,
        customEmailValidator(this.emailRegExp)
      ]
      ],
      'userPassword':  [this.user.password, [
        Validators.required,
        Validators.minLength(8)
      ]
      ],
      'isRemember': [this.user.isRemembered]
    });

    this.userEmail = this.loginForm.controls['userEmail'];
    this.userPassword = this.loginForm.controls['userPassword'];
    this.isRemember = this.loginForm.controls['isRemember'];

    this.loginForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
  }

  onValueChanged(data?: any) {
    if (!this.loginForm) { return; }
    const form = this.loginForm;

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
    this.login();
  }

  login() {
    this.authService.login(this.user).subscribe(
      (resp) => {
        localStorage.setItem('currentUser', JSON.stringify(resp));
        localStorage.setItem('isRemembered', JSON.stringify(this.user.isRemembered));
        this.router.navigate([this.returnUrl]);
      },
      (err) => {
        const errorMsg = JSON.parse(err._body).msg;
        this.openDialog(this.errorsMsgList[this.errorsMsgListKeys.indexOf(errorMsg)]);
      }
    );
  }

  changePasswordType() {
    this.userPassEl.nativeElement.type = this.show ? 'password' : 'text';
    this.show = !this.show;
  }

  openDialog(msg) {
    const dialogRef = this.dialog.open(InfoDialogComponent);
    dialogRef.componentInstance.infoText = msg;
  }
}
