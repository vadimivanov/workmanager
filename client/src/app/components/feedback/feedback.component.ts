import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProviderServicesService } from '../../shared/services/provider-services/provider-services.service';
import { ProfileService } from '../../shared/services/profile/profile.service';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidatorFn,
  FormControl
} from '@angular/forms';
import { MdDialog } from '@angular/material';
import { AuthService } from '../../shared/services/auth/auth.service';
import { InfoDialogComponent } from '../../shared/components/modals/info-dialog/info-dialog.component';
import { RATING } from '../../shared/constants';
import { Feedback } from '../../shared/models/feedback.model';
import { FormUtilsService } from '../../shared/forms/form-utils.service';
import { customEmailValidator } from '../../shared/components/validation/email-validator.directive';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit, OnDestroy {

  public feedback: Feedback;

  private emailRegExp: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  form2: FormGroup;
  email: AbstractControl;
  companyName = '';
  companyEmail: AbstractControl;
  title: AbstractControl;
  category: AbstractControl;
  description: AbstractControl;
  range: AbstractControl;
  serviceName: string;
  serviceId: number;
  userId: number;

  starAmount = RATING;
  categoriesList: any = [];
  companyList: any = [];
  companySearchList: any = [];
  companySearchMap: Array<any> = [];
  companySearchFilter: Array<any> = [];
  images: any = [];
  imagesUpload: any = [];
  providersImagesUpload: any = [];
  isDisabledSlider = false;
  isPresentation = false;
  isDigitalValueShow = [false, false];
  isFormValid = true;
  qualityList: any = {};
  isSubmitOnce = false;
  limitImages: number = 0;
  queryParams: any;
  requestFeedback: any;
  isHideFields = false;

  // autocomplete
  stateCtrl: FormControl;
  filteredFirmNames: any = [];
  costRange: any = [];

  ratingsList: any = [
    {
      name: 'Qualität der Arbeit',
      key: 'quality_of_work',
      stars: [1, 2, 3, 4, 5],
      value: 0
    },
    {
      name: 'Preis-Leistung',
      key: 'quality_of_price',
      stars: [1, 2, 3, 4, 5],
      value: 0
    },
    {
      name: 'Kommunikation und Service',
      key: 'quality_of_friendliness',
      stars: [1, 2, 3, 4, 5],
      value: 0
    },
    {
      name: 'Zuverlässigkeit',
      key: 'quality_of_timeschedule',
      stars: [1, 2, 3, 4, 5],
      value: 0
    }
  ];

  formErrors = {
    'company_name': '',
    'provider_email': '',
    'service_name': '',
    'job_title': '',
    'job_description': '',
    'quality_of_work': '',
    'quality_of_price': '',
    'quality_of_friendliness': '',
    'quality_of_timeschedule': ''
  };

  validationMessages = {
    'required': 'Dieses Feld wird benötigt.',
    'validateEmail': 'Bitte geben Sie eine gültige E-Mail Adresse an.'
  };

  constructor(
    private fb: FormBuilder,
    formUtils: FormUtilsService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MdDialog,
    private profileService: ProfileService,
    private authService: AuthService,
    private providerServicesService: ProviderServicesService) {
    this.feedback = formUtils.feedback;
  }

  filterFirmNames(val: string) {
    this.companySearchFilter = this.companySearchList.filter(s => new RegExp(`${val}`, 'gi').test(s));
    return val ? this.companySearchFilter : this.companySearchList;
  }

  isSelectedCompanyName() {
    return (this.companySearchFilter.length === 1) &&
           (this.companySearchFilter[0] === this.companyName);
  }

  ngOnInit() {
    this.queryParams = this.route.queryParams;
    this.requestFeedback = this.queryParams._value.feedback ? JSON.parse(this.queryParams._value.feedback) : null;
    if (this.requestFeedback != null) {
      this.isHideFields = true;
    }
    this.buildForm();

    if (this.requestFeedback) {
      this.fillForm(this.requestFeedback);
    }

    if (this.authService.getUser().user) {
      this.userId = this.authService.getUser().user.id;

      this.profileService.getUsersPlansLimit(this.userId).subscribe(
        (resp) => {
          if (resp.photos_feedback_request_limit) {
            this.limitImages = resp.photos_feedback_request_limit;
          }
        }
      );
    }

    this.providerServicesService.services.subscribe(
      (resp) => {
        this.categoriesList = resp;
      }
    );

    this.providerServicesService.getProviders().subscribe(
      (resp) => {
        if (resp.length) {
          this.companyList = resp;
          this.getCompanyNamesList();
          this.createCompanyMap();
        }
      }
    );

    this.stateCtrl = new FormControl();
    this.filteredFirmNames = this.stateCtrl.valueChanges
      .startWith(null)
      .map(name => this.filterFirmNames(name));
  }

  ngOnDestroy() {
    this.clearForm();
  }

  buildForm(): void {
    this.form2 = this.fb.group({
      range: [[2, 8]],
      disabled: this.isDisabledSlider,
      company_name: ['', Validators.required],
      'provider_email': [this.feedback.provider_email, [
        Validators.required,
        customEmailValidator(this.emailRegExp)
      ]],
      service_name: [this.feedback.service_name, Validators.required],
      job_title: [this.feedback.job_title, Validators.required],
      job_description: [this.feedback.job_description, Validators.required],
      quality_of_work: [this.feedback.quality_of_work, Validators.required],
      quality_of_price: [this.feedback.quality_of_price, Validators.required],
      quality_of_friendliness: [this.feedback.quality_of_friendliness, Validators.required],
      quality_of_timeschedule: [this.feedback.quality_of_timeschedule, Validators.required],
      imagesUpload: []
    });

    this.companyEmail = this.form2.controls['provider_email'];
    this.category = this.form2.controls['service_name'];
    this.title = this.form2.controls['job_title'];
    this.description = this.form2.controls['job_description'];
    this.range = this.form2.controls['range'];

    this.form2.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  }

  clearForm() {
    this.feedback.job_title = '';
    this.feedback.job_description = '';
    this.feedback.service_name = '';
    this.companyName = '';
    this.providersImagesUpload = [];
  }

  fillForm(feedbackData) {
    this.feedback.job_title = feedbackData.job_title;
    this.feedback.job_description = feedbackData.message;
    this.feedback.service_name = feedbackData.service_name;
    this.companyName = feedbackData.Provider.company_name;
    this.providersImagesUpload = feedbackData.photo_urls;
  }

  onValueChanged(data?: any) {
    if (!this.form2) { return; }
    const form = this.form2;

    for (const field in this.formErrors) {
      this.formErrors[field] = '';
      const control = form.get(field);

      if (control && control.dirty && control.invalid) {
        this.formErrors[field] = this.validationMessages.required;
        if (field === 'provider_email'
          && this.form2.controls.provider_email.errors.validateEmail) {
          this.formErrors[field] = this.validationMessages.validateEmail;
        }
      }
    }
  }

  onChanges(event) {
    this.costRange = event;
    this.feedback.project_cost = event;
  }

  getCompanyNamesList() {
    this.companySearchList = this.companyList
      .filter((companies) => {
        return companies.company_name !== null;
      })
      .map((companies) => {
        return companies.company_name;
      });
  }

  createCompanyMap() {
    for (let i = 0; i < this.companyList.length; i++) {
      this.companySearchMap[this.companyList[i].company_name] = this.companyList[i].id;
    }
  }

  updateCheckedOptions(obj, id, star, starAmount) {
    const key = obj.key;
    this.qualityList[key] = star;
    this.ratingsList[id].value = star;
    this.feedback[key] = star;
    this.onValueChanged();
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
      }
    );
  }

  deleteImage(index, imagesType) {
    if (imagesType === 'images') {
      this.images.splice(index, 1);
      this.imagesUpload.splice(index, 1);
    } else {
      this.providersImagesUpload.splice(index, 1);
    }
  }

  checkedRating() {
    this.isFormValid = true;
    for (let i in this.formErrors) {
      if (!this.feedback[i]) {
        this.formErrors[i] = this.validationMessages.required;
        this.isFormValid = false;        
        if ((i === 'provider_email' && this.companyName.length && this.isSelectedCompanyName()) ||
          (i === 'provider_email' && this.requestFeedback && !this.companySearchFilter.length)) {
          this.feedback['provider_email'] = null;
          this.isFormValid = true;
        }
      } else {
        this.formErrors[i] = '';
        if (i === 'provider_email'
            && this.form2.controls.provider_email.errors
            && this.form2.controls.provider_email.errors.validateEmail) {
          this.formErrors[i] = this.validationMessages.validateEmail;
          this.isFormValid = false;
        }
      }
    }
  }

  onSubmit(value: any) {
    this.isSubmitOnce = true;

    for (let i = 0; i < this.categoriesList.length; i++) {
      if (this.categoriesList[i].name === this.feedback.service_name) {
        this.serviceId = this.categoriesList[i].id;
      }
    }
    this.feedback.company_name = value.company_name || this.companyName;
    this.feedback.service_id = this.serviceId;
    this.feedback.provider_id = this.companySearchMap[this.companyName];
    this.feedback.photo_urls = this.providersImagesUpload.concat(this.imagesUpload);
    this.feedback.feedback_request_id = this.requestFeedback ? this.requestFeedback.id : null;
    this.feedback.quoted_job_description = value.job_description.slice(0, 160);
    this.checkedRating();
    if (this.isFormValid) {
      this.profileService.sendFeedback(this.userId, 'rater', this.feedback).subscribe(
        (resp) => {
          this.clearForm();
          this.router.navigate(['/home']);
          this.openDialog();
        }
      );
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(InfoDialogComponent);
    dialogRef.componentInstance.infoText = 'Vielen Dank. Ihre Bewertung wurde gesendet.';
  }

}
