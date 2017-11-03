import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidatorFn
} from '@angular/forms';
import { debounce } from 'lodash';

import { ProfileService } from '../../../../../shared/services/profile/profile.service';
import { Provider } from '../../../../../shared/models/provider.model';
import { FormUtilsService } from '../../../../../shared/forms/form-utils.service';
import { GeocodingService } from '../../../../../shared/services/geocoding/geocoding.service';
import { ProviderSearchService } from '../../../../../shared/services/provider-search/provider-search.service';
import { ProviderCompany } from '../../../../../shared/models/provider-company.model';

export function zipValidation(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => {
    const input = control.value,
      isValid = /^[0-9]{4}$/.test(input);
    if (isValid) {
      return null;
    } else {
      return {'zipValidation': {input}}
    }
  };
}

@Component({
  selector: 'app-sign-up-provider-step-one',
  templateUrl: './sign-up-provider-step-one.component.html',
  styleUrls: ['./sign-up-provider-step-one.component.scss']
})
export class SignUpProviderStepOneComponent implements OnInit {

  protected avatar: File;
  public provider: Provider;
  public existingProviderCompany: ProviderCompany;

  postalCodes = [];
  cities = [];
  filteredCities: any;
  zipCodes = [];
  filteredZipCodes: any;
  zipPattern = /^[0-9]{4}$/;

  stepOneForm: FormGroup;
  companyName: AbstractControl;
  companyAddress: AbstractControl;
  companyAddress2: AbstractControl;
  companyPlz: AbstractControl;
  companyOrt: AbstractControl;
  imageUrl: string = '';

  formErrors = {
    'companyName': '',
    'companyAddress': '',
    'companyPlz': '',
    'companyOrt': ''
  };

  validationMessages = {
    'companyName': {
      'required': 'Der Name der Firma ist erforderlich.'
    },
    'companyAddress': {
      'required': 'Company address is required.'
    },
    'companyPlz': {
      'required': 'Der PLZ der Firma ist erforderlich.',
      'zipValidation': 'Der PLZ muss gültig sein'
    },
    'companyOrt': {
      'required': 'Der Ort der Firma ist erforderlich.'
    }
  };

  @ViewChild('searchField') el: ElementRef;
  @ViewChild('searchCity') elCity: ElementRef;

  constructor(
    private fb: FormBuilder,
    formUtils: FormUtilsService,
    private router: Router,
    private r: ActivatedRoute,
    private profileService: ProfileService,
    private geocodingService: GeocodingService,
    private providerSearchService: ProviderSearchService) {
    this.provider = formUtils.provider;
    this.provider.photoUrl = null;
  }

  ngOnInit() {
    this.buildForm();

    Observable.fromEvent(this.el.nativeElement, 'keyup')
      .map((e: any) => e.target.value)
      .do(() => {
        this.postalCodes = [];
      })
      .filter((text: string) => text.length > 2)
      .debounceTime(300)
      .map((query: string) => this.geocodingService.searchPart(query, 'zipPart'))
      .switch()
      .subscribe(
        (resp: any) => {
          if (resp) {
            for (let i = 0; i < resp.length; i++) {
              let obj = resp[i];
              this.postalCodes.push({
                zip: obj.zip,
                city: obj.Cities[0].city
              });
            }
            return this.postalCodes;
          }
        },
        (err: any) => {
          console.log(err);
        },
        () => {
        }
      );

    Observable.fromEvent(this.elCity.nativeElement, 'keyup')
      .map((e: any) => e.target.value)
      .do(() => {
        this.postalCodes = [];
      })
      .filter((text: string) => text.length > 2)
      .debounceTime(300)
      .map((query: string) => this.geocodingService.searchPart(query, 'cityPart'))
      .switch()
      .subscribe(
        (resp: any) => {
          if (resp) {
            for (let i = 0; i < resp.length; i++) {
              let obj = resp[i];
              this.postalCodes.push({
                zip: obj.zip,
                city: obj.Cities[0].city
              });
            }
            return this.postalCodes;
          }
        },
        (err: any) => {
          console.log(err);
        },
        () => {
        }
      );
  }

  buildForm(): void {
    this.stepOneForm = this.fb.group({
      'companyName':  [this.provider.companyName, Validators.required],
      'companyAddress':  [this.provider.companyAddress, Validators.required],
      'companyAddress2':  [this.provider.companyAddress2],
      'companyPlz':  [this.provider.companyPlz, [
          Validators.required,
          zipValidation()
        ]
      ],
      'companyOrt':  [this.provider.companyOrt, Validators.required]
    });

    this.companyName = this.stepOneForm.controls['companyName'];
    this.companyAddress = this.stepOneForm.controls['companyAddress'];
    this.companyAddress2 = this.stepOneForm.controls['companyAddress2'];
    this.companyPlz = this.stepOneForm.controls['companyPlz'];
    this.companyOrt = this.stepOneForm.controls['companyOrt'];

    this.filteredZipCodes = this.companyPlz.valueChanges
      .startWith(null)
      .map(name => this.filterPostalCodes(name, 'zipPart'));
    this.filteredCities = this.companyOrt.valueChanges
      .startWith(null)
      .map(name => this.filterPostalCodes(name, 'cityPart'));

    this.stepOneForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
  }

  filterPostalCodes(val: string, param: string) {
    // return val ? this.postalCodes.filter(s => new RegExp(`^${val}`, 'gi').test(s[param]))
    //   : this.postalCodes;
    // return this.getSerchResult(val, param);
  }

  onValueChanged(data?: any) {
    if (!this.stepOneForm) { return; }
    const form = this.stepOneForm;

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

  setZip(postalData) {
    this.provider.companyPlz = postalData.zip;
    this.provider.companyOrt = postalData.city;
    this.postalCodes = [];
    this.getLocation(postalData.city);
  }

  setCity(postalData) {
    this.provider.companyPlz = postalData.zip;
    this.provider.companyOrt = postalData.city;
    this.postalCodes = [];
    this.getLocation(postalData.city);
  }

  getLocation(city) {
    this.geocodingService.search(city, 'city').subscribe(
      (resp) => {
        if (resp[0].location) {
          this.provider.locations = {
            latitude: resp[0].location.lat,
            longitude: resp[0].location.lng
          };
        }
      }
    );
  }

  checkProviderName() {
    if (!(this.provider.companyName && this.provider.companyName.length)) {
      return;
    }
    this.existingProviderCompany = null;
    this.providerSearchService.doSearch(this.provider.companyName, '').subscribe(
      (resp) => {
        if (resp.length) {
          resp.map((item) => {
            if (item.company_name === this.provider.companyName) {
              this.existingProviderCompany = item;
              console.log(item);
            }
            return item;
          });
        }
      }
    )
  }

  goToProfile() {
    this.router.navigate(['provider-profile', this.existingProviderCompany.user_id]);
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
        console.log('uploadImages ', resp.Location);
        this.provider.photoUrl = resp.Location;
      },
      (error) => console.log('error - upload', error)
    );
  }

  back() {
    this.router.navigate(['/register']);
  }

  next() {
    this.provider.companyName = this.stepOneForm.value.companyName;
    this.provider.companyAddress = this.stepOneForm.value.companyAddress;
    this.provider.companyAddress2 = this.stepOneForm.value.companyAddress2;
    this.provider.companyOrt = this.stepOneForm.value.companyOrt;
    this.provider.companyPlz = this.stepOneForm.value.companyPlz;

    this.router.navigate(['../step-two'], { relativeTo: this.r });
  }
}
