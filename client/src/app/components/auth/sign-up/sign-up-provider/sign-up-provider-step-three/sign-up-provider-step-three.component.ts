import { Component, ViewChild, OnInit, Compiler } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidatorFn
} from '@angular/forms';
import { MdDialog } from '@angular/material';

import { ProviderServicesService } from '../../../../../shared/services/provider-services/provider-services.service';
import { Provider } from '../../../../../shared/models/provider.model';
import { FormUtilsService } from '../../../../../shared/forms/form-utils.service';
import { AuthService } from '../../../../../shared/services/auth/auth.service';
import { ProfileService } from '../../../../../shared/services/profile/profile.service';
import { customEmailValidator } from '../../../../../shared/components/validation/email-validator.directive';
import { InfoDialogComponent } from '../../../../../shared/components/modals/info-dialog/info-dialog.component';

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
  selector: 'app-sign-up-provider-step-three',
  templateUrl: './sign-up-provider-step-three.component.html',
  styleUrls: ['./sign-up-provider-step-three.component.scss']
})
export class SignUpProviderStepThreeComponent implements OnInit {
  public provider: Provider;
  private show = false;
  private emailRegExp: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  @ViewChild('userPassEl')
  userPassEl: any;
  isButtonDisabled = false;

  genders = [
    {id: 0, title: 'Herr', name: 'Male'},
    {id: 1, title: 'Frau', name: 'Female'}
  ];

  stepThreeForm: FormGroup;
  gender: AbstractControl;
  firstName: AbstractControl;
  lastName: AbstractControl;
  telNo: AbstractControl;
  email: AbstractControl;
  password: AbstractControl;
  subscribe: AbstractControl;

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
      'telValidation': 'Die Telefonnummer muss mit +41 beginnen und 10 Nummern lang sein.'
    },
    'email': {
      'required': 'E-Mail ist ein Pflichtfeld.',
      'validateEmail': 'Die E-Mail muss gültig sein.'
    },
    'password': {
      'required': 'Passwort ist ein Pflichtfeld.',
      'minlength': 'Das Passwort muss mindestens 8 Zeichen lang sein und aus Grossbuchstaben, Kleinbuchstaben und Zahlen bestehen'
    }
  };

  constructor(
    public dialog: MdDialog,
    private fb: FormBuilder,
    formUtils: FormUtilsService,
    private router: Router,
    private r: ActivatedRoute,
    private authService: AuthService,
    private providerServicesService: ProviderServicesService,
    private profileService: ProfileService,
    private _compiler: Compiler) {
    this.provider = formUtils.provider;
  }

  ngOnInit() {
    this.provider.telNo = '+41';
    this.buildForm();
    this.provider.subscribe = true;
  }

  buildForm(): void {
    this.stepThreeForm = this.fb.group({
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
      ],
      'password':  [this.provider.password, [
          Validators.required,
          Validators.minLength(8)
        ]
      ],
      'subscribe': [this.subscribe]
    });

    this.gender = this.stepThreeForm.controls['gender'];
    this.firstName = this.stepThreeForm.controls['firstName'];
    this.lastName = this.stepThreeForm.controls['lastName'];
    this.telNo = this.stepThreeForm.controls['telNo'];
    this.email = this.stepThreeForm.controls['email'];
    this.password = this.stepThreeForm.controls['password'];
    this.subscribe = this.stepThreeForm.controls['subscribe'];

    this.stepThreeForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
  }

  onValueChanged(data?: any) {
    if (!this.stepThreeForm) { return; }
    const form = this.stepThreeForm;

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

  changePasswordType() {
    this.userPassEl.nativeElement.type = this.show ? 'password' : 'text';
    this.show = !this.show;
  }

  back() {
    this.router.navigate(['../step-two'], { relativeTo: this.r });
  }

  next() {
    this.isButtonDisabled = true;
    this.provider.gender = this.stepThreeForm.value.gender;
    this.provider.firstName = this.stepThreeForm.value.firstName;
    this.provider.lastName = this.stepThreeForm.value.lastName;
    this.provider.telNo = this.stepThreeForm.value.telNo;
    this.provider.email = this.stepThreeForm.value.email;
    this.provider.password = this.stepThreeForm.value.password;
    this.provider.subscribe = this.stepThreeForm.value.subscribe;

    this.provider.login = this.stepThreeForm.value.firstName;

    this.register();
  }

  register() {
    this.authService.register(this.provider, 'provider').subscribe(
      (provider) => {
        this.provider.providerId = provider.id;
        this.signUp(provider.JWT);
        this.saveSubservices(provider.JWT);
      },
      (error) => {
        this.isButtonDisabled = false;
        this.provider.email = '';
        console.log('Unfortunately we were unable to create your account.', error);
      }
    );
  }

  saveSubservices(jwt) {
    this.authService.saveSubcategories(this.provider.providerId, this.provider.servicesMap, jwt).subscribe(
      (resp) => {
      },
      (err) => {
      }
    );
  }

  signUp(token) {
    let providerData = {
      Locations: [{
        city: this.provider.companyOrt,
        house_number: this.provider.companyAddress2,
        location_coordinates: {
          lat: this.provider.locations.latitude,
          lng: this.provider.locations.longitude
        },
        name: this.provider.companyName,
        street: this.provider.companyAddress,
        zip_code: +this.provider.companyPlz,
      }],
      about: '',
      company_name: this.provider.companyName,
      contact_information: {
        emergency_number: {
          number: null,
          is_visible: false
        }
      },
      contact_person_info: {
        contactEmail: this.provider.email,
        first_name: this.provider.firstName,
        gender: this.provider.gender,
        last_name: this.provider.lastName,
        personalPhone: null,
        workPhone: this.provider.telNo,
        is_visible: false
      },
      foundation_year: new Date(),
      hours_of_operation: '',
      number_of_employees: 1,
      photo_url: this.provider.photoUrl
    };
    this.authService.signup(providerData, this.provider.providerId, token, 'provider').subscribe(
      (resp) => {
        if (!this.provider.subscribe) {
          this.profileService.changeNotificationSettings(resp.user_id, {is_feedbacks_notify: false}, token).subscribe(
            (resp) => {},
            (error) => { console.log(error); }
          );
        }
        this.profileService.addLocations(resp.user_id, providerData.Locations[0], token).subscribe(
          (resp) => {}
        );
        this.profileService.emailConfirmation(resp.user_id).subscribe(
          (resp) => {
            this.openDialog();
            this.router.navigate(['/home']);
            this.clearData();
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
  }

  clearData() {
    this._compiler.clearCache();
    this.provider.companyOrt = '';
    this.provider.companyAddress2 = '';
    this.provider.locations.latitude = null;
    this.provider.locations.longitude = null;
    this.provider.companyName = '';
    this.provider.companyAddress = '';
    this.provider.companyPlz = '';
    this.provider.companyName = '';
    this.provider.email = '';
    this.provider.firstName = '';
    this.provider.gender = null;
    this.provider.lastName = '';
    this.provider.telNo = '';
    this.provider.photoUrl = '';
    this.provider.password = '';
  }

  login() {
    this.authService.login(this.provider).subscribe(
      (resp) => {
        localStorage.setItem('currentUser', JSON.stringify(resp));
        this.router.navigate(['/home']);
      }
    );
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
