import {Component, HostBinding, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl
} from '@angular/forms';

import { customEmailValidator } from '../validation/email-validator.directive';
import { ProfileService } from '../../services/profile/profile.service';
import { DialogService } from '../../../shared/services/dialog/dialog.service';
import config from '../../config';

class ContactMessage {
  name: string;
  email: string;
  text: string;
}

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent implements OnInit {
  @HostBinding('class.form-block') 1;
  private reCaptchaKey: string = config.reCaptchaKey;
  public isPassedCaptcha = false;
  private emailRegExp: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  public contact: ContactMessage = {
    name: '',
    email: '',
    text: ''
  };

  contactForm: FormGroup;
  contactName: AbstractControl;
  contactEmail: AbstractControl;
  contactText: AbstractControl;

  formErrors = {
    'contactName': '',
    'contactEmail': '',
    'contactText': ''
  };

  validationMessages = {
    'contactName': {
      'required': 'Name is required.'
    },
    'contactText': {
      'required': 'Die Nachricht  ist erforderlich.'
    },
    'contactEmail': {
      'required': 'Die E-Mail ist erforderlich.',
      'validateEmail': 'Die E-Mail muss gültig sein.'
    }
  };

  constructor(private route: ActivatedRoute,
              private fb: FormBuilder,
              private profileService: ProfileService,
              private dialogService: DialogService) { }

  ngOnInit() {
    this.route.fragment.subscribe(f => {
      const element = document.querySelector('#' + f);
      if (element) {
        element.scrollIntoView(element);
      }
    });
    this.buildForm();
  }

  buildForm(): void {
    this.contactForm = this.fb.group({
      'contactName':  [this.contact.name, Validators.required],
      'contactText':  [this.contact.text, Validators.required],
      'contactEmail':  [this.contact.email, [
        Validators.required,
        customEmailValidator(this.emailRegExp)
      ]
      ]
    });

    this.contactName = this.contactForm.controls['contactName'];
    this.contactText = this.contactForm.controls['contactText'];
    this.contactEmail = this.contactForm.controls['contactEmail'];

    this.contactForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
  }

  onValueChanged(data?: any) {
    if (!this.contactForm) { return; }
    const form = this.contactForm;

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
    this.sendEmail(value);
  }

  sendEmail(value) {
    this.profileService.sendEmail(value.contactEmail, value.contactName, value.contactText).subscribe(
      (resp) => {
        this.contact = {
          name: '',
          email: '',
          text: ''
        };
        this.buildForm();
        this.dialogService.infoDialog('Email has been successfully sent');
      }
    );
  }

  isValidForm() {
    return this.contactForm.valid && this.isPassedCaptcha;
  }

  resolved(captchaResponse: string) {
    this.isPassedCaptcha = true;
  }

}
