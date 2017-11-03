import { Component, Input, HostBinding } from '@angular/core';

@Component({
  selector: 'app-register-steps',
  templateUrl: './register-steps.component.html',
  styleUrls: ['./register-steps.component.scss']
})
export class RegisterStepsComponent {
  @HostBinding('class.sign-up-provider__header') 1;
  @Input() activeStep: number;

  steps = [
    {stepNo: 1, title: 'Angaben zur Firma'},
    {stepNo: 2, title: 'Dienstleistungskategorien auswählen'},
    {stepNo: 3, title: 'Benutzerkontodaten erfassen'}
  ]
}
