import { Component, OnInit } from '@angular/core';
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

import { InfoDialogComponent } from '../../shared/components/modals/info-dialog/info-dialog.component';
import { ProviderServicesService } from '../../shared/services/provider-services/provider-services.service';
import { ProfileService } from '../../shared/services/profile/profile.service';
import { AuthService } from '../../shared/services/auth/auth.service';
import { customEmailValidator } from '../../shared/components/validation/email-validator.directive';

@Component({
  selector: 'app-feedback-request',
  templateUrl: './feedback-request.component.html',
  styleUrls: ['./feedback-request.component.scss']
})
export class FeedbackRequestComponent implements OnInit {
  private emailRegExp: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  categoriesList: any;
  companyList: any;
  images: any = [];
  imagesUpload: any = [];
  raterId: number;
  provider: any;
  limitImages: number = 0;
  isEmailValid = false;
  isFormValid = false;
  isNewRater = false;

  reqFirm: string;
  reqTitle: string;
  reqBody: string;
  reqEmail: string;
  reqCategory: any;

  feedbackForm: FormGroup;

  formFirm: AbstractControl;
  formTitle: AbstractControl;
  formText: AbstractControl;
  formEmail: AbstractControl;
  formCategory: AbstractControl;

  formErrors = {
    'formFirm': '',
    'formTitle': '',
    'formText': '',
    'formEmail': '',
    'formCategory': ''
  };

  validationMessages = {
    'formFirm': {
      'required': 'Der Name der Firma ist erforderlich'
    },
    'formTitle': {
      'required': 'Der Auftragstitel Text  ist erforderlich'
    },
    'formText': {
      'required': 'Die Nachricht  ist erforderlich'
    },
    'formEmail': {
      'required': 'Die E-Mail ist erforderlich.',
      'validateEmail': 'Bitte geben Sie eine gültige E-Mail Adresse an.'
    },
    'formCategory': {
      'required': 'Die Kategorie ist erforderlich'
    }
  };

  constructor(
    public dialog: MdDialog,
    private router: Router,
    private fb: FormBuilder,
    private providerServicesService: ProviderServicesService,
    private profileService: ProfileService,
    private authService: AuthService) {
  }

  ngOnInit() {
    this.providerServicesService.services.subscribe(
      (resp) => {
        this.categoriesList = resp;
      }
    );

    this.providerServicesService.getProviders().subscribe(
      (resp) => {
        this.companyList = resp;
      }
    );

    this.profileService.getUserRoleData(this.authService.getUser().user.id, 'provider').subscribe(
      (resp) => {
        this.reqFirm = resp.json().company_name;
        this.provider = resp.json();

        this.getUserLimit();
      }
    );

    this.buildForm();
  }

  getUserLimit() {
    this.profileService.getUsersPlansLimit(this.provider.user_id).subscribe(
      (resp) => {
        if (resp.photos_feedback_request_limit) {
          this.limitImages = resp.photos_feedback_request_limit;
        }
      }
    );
  }

  buildForm(): void {
    this.feedbackForm = this.fb.group({
      'formTitle': [this.reqTitle, Validators.required],
      'formText': [this.reqBody, Validators.required],
      'formEmail': [this.reqEmail, [
        Validators.required,
        customEmailValidator(this.emailRegExp)
      ]
      ],
      'formCategory': [this.reqCategory, Validators.required],
    });

    this.formTitle = this.feedbackForm.controls['formTitle'];
    this.formText = this.feedbackForm.controls['formText'];
    this.formEmail = this.feedbackForm.controls['formEmail'];
    this.formCategory = this.feedbackForm.controls['formCategory'];

    this.feedbackForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  }

  onValueChanged(data?: any) {
    if (!this.feedbackForm) { return; }
    const form = this.feedbackForm;

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

  readUrl(event) {
    if (event.target.files && event.srcElement.files[0]) {
      const files = event.srcElement.files;
      const file = files[0];
      const formData = new FormData();
      formData.append('file', file);

      let reader = new FileReader();

      this.upload(formData);
      reader.onload = (e: any) => {
        this.images.push(e.target.result);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  upload(file) {
    this.profileService.uploadImages(file).subscribe(
      (resp) => {
        this.imagesUpload.push(resp.Location);
      },
      (error) => console.log('error - upload', error)
    );
  }

  deleteImage(index) {
    this.images.splice(index, 1);
    this.imagesUpload.splice(index, 1);
  }

  getUserByEmail() {
    if (!this.formEmail.valid) {
      return;
    }
    this.profileService.getUserByEmail(this.reqEmail).subscribe(
      (resp) => {
        if (resp.status === 204) {
          this.isNewRater = true;
          this.isEmailValid = false;
        }
        if (resp.status === 200) {
          this.isEmailValid = true;
          this.isNewRater = false;
          this.getRater(resp.json()[0].id, 'rater');
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getRater(id, role) {
    this.profileService.getUserRoleData(id, role).subscribe(
      (resp) => {
        if (resp.status === 200) {
          this.raterId = resp.json().id;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  validationForm() {
    this.isFormValid = true;
    for (let i in this.feedbackForm.value) {
      if (!this.feedbackForm.value[i] && i != 'formCategory') {
        this.isFormValid = false;
      }
    }
  }

  onSubmit(value: string): void {
    let data = {
      job_title: this.reqTitle,
      message: this.reqBody,
      photo_urls: this.imagesUpload,
      rater_id: this.raterId,
      service_id: this.reqCategory,
      rater_email: this.reqEmail,
      provider_id: this.provider.id,
      provider_email: this.authService.getUser().user.email
    };
    this.validationForm();
    if (this.isFormValid) {
      if (this.isNewRater) {
        this.sendFeedbackRequestEmail();
      } else {
        this.sendFeedbackRequest(this.provider.user_id, 'provider', data);
      }
    }
  }

  sendFeedbackRequest(id, role, data) {
    this.profileService.sendFeedbackRequest(id, role, data).subscribe(
      (resp) => {
        this.openDialog();
        this.router.navigate(['/home']);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  sendFeedbackRequestEmail() {
    let data = {
      email_for_notification: this.reqEmail,
      job_title: this.reqTitle,
      message: this.reqBody
    };
    this.profileService.sendFeedbackRequestEmail(this.provider.user_id, 'provider', data).subscribe(
      (resp) => {
        this.openDialog();
        this.router.navigate(['/home']);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  openDialog() {
    const dialogRef = this.dialog.open(InfoDialogComponent);
    dialogRef.componentInstance.infoText = 'Danke. Ihre Anfrage wurde per Email gesendet.';
  }
}
